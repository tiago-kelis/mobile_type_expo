import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { makeStyles } from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import {
  Appointment,
  getQueueByDate,
  getMyAppointments,
  createAppointment,
  updateAppointmentStatus,
} from '../../api/appointments';
import {
  Service,
  getActiveServices,
} from '../../api/services';
import {
  Professional,
  getOnDutyProfessionals,
  getProfessionalsByService,
} from '../../api/professionals';
import { RootStackParamList } from '../../routers/types';

type AppointmentsScreenRouteProp = RouteProp<RootStackParamList, 'Appointments'>;

const getLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatQueueName = (fullName: string, isCurrentUser: boolean): string => {
  if (isCurrentUser) return fullName;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const initials  = parts.slice(1).map(p => p[0].toUpperCase() + '.').join(' ');
  return `${firstName} ${initials}`;
};

export default function Appointments() {
  const navigation         = useNavigation();
  const route              = useRoute<AppointmentsScreenRouteProp>();
  const { user }           = route.params as { user: any };
  const { theme }          = useTheme();
  const { user: authUser } = useAuth();
  const styles             = makeStyles(theme);

  // ── estados ────────────────────────────────────────────────────────────────
  const [refreshing, setRefreshing]               = useState(false);
  const [loading, setLoading]                     = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const [selectedQueueServiceId, setSelectedQueueServiceId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId]           = useState<number | null>(null);

  // form
  const [selectedProfId, setSelectedProfId]   = useState<number | null>(null);
  const [description, setDescription]         = useState('');
  const [selectedDate, setSelectedDate]       = useState(new Date());
  const [selectedTime, setSelectedTime]       = useState(new Date());
  const [showDatePicker, setShowDatePicker]   = useState(false);
  const [showTimePicker, setShowTimePicker]   = useState(false);

  // dados
  const [myAppointments, setMyAppointments]           = useState<Appointment[]>([]);
  const [todayQueue, setTodayQueue]                   = useState<Appointment[]>([]);
  const [services, setServices]                       = useState<Service[]>([]);
  const [onDutyProfessionals, setOnDutyProfessionals] = useState<Professional[]>([]);
  const [formProfessionals, setFormProfessionals]     = useState<Professional[]>([]);

  // ✅ refs — não causam re-render
  const selectedQueueServiceRef = useRef<number | null>(null);
  const isPickingForForm = useRef(false);

  useNotifications(myAppointments);

  // ✅ sincroniza ref com state — fora de qualquer outro useEffect
  useEffect(() => {
    selectedQueueServiceRef.current = selectedQueueServiceId;
  }, [selectedQueueServiceId]);

  // ── helpers ────────────────────────────────────────────────────────────────

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');

  const formatTime = (t: string) => t.substring(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':       return theme.statusAgendado;
      case 'em_atendimento': return theme.statusEmAtendimento;
      case 'concluido':      return theme.statusConcluido;
      case 'cancelado':      return theme.statusCancelado;
      default:               return theme.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado':       return 'Agendado';
      case 'em_atendimento': return 'Em Atendimento';
      case 'concluido':      return 'Concluído';
      case 'cancelado':      return 'Cancelado';
      default:               return status;
    }
  };

  const filteredQueue = selectedQueueServiceId
    ? todayQueue.filter(a => a.service_id === selectedQueueServiceId)
    : todayQueue;

  const selectedQueueService = services.find(s => s.id === selectedQueueServiceId) ?? null;
  const selectedService      = services.find(s => s.id === selectedServiceId) ?? null;

  // ── dados ──────────────────────────────────────────────────────────────────

  const loadData = useCallback(async (): Promise<Service[]> => {
    try {
      const today = getLocalDateString(new Date());
      const [queue, mine, svcs, onDuty] = await Promise.all([
        getQueueByDate(today),
        getMyAppointments(),
        getActiveServices(),
        getOnDutyProfessionals(),
      ]);

      setServices(svcs);
      setOnDutyProfessionals(onDuty);
      setMyAppointments(mine);

      const filteredQ = authUser?.role === 'admin'
        ? queue
        : queue.filter(a => a.status === 'agendado' || a.status === 'em_atendimento');

      setTodayQueue(filteredQ);
      return svcs;
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error.message);
      Alert.alert(
        'Erro de conexão',
        `Não foi possível carregar os dados.\n\n${error.message}`,
        [{ text: 'Tentar novamente', onPress: loadData }]
      );
      return [];
    }
  }, [authUser?.role]); // ✅ SÓ authUser — nunca selectedQueueServiceId

  // ✅ carrega profissionais ao selecionar serviço no form
  useEffect(() => {
    if (!selectedServiceId) {
      setFormProfessionals([]);
      setSelectedProfId(null);
      return;
    }

    getProfessionalsByService(selectedServiceId)
      .then((profs) => {
        setFormProfessionals(profs);
        setSelectedProfId(profs.length === 1 ? profs[0].id : null);
      })
      .catch(() => {
        setFormProfessionals([]);
        setSelectedProfId(null);
      });
  }, [selectedServiceId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ✅ useFocusEffect SEM selectedQueueServiceId nas deps — usa ref
 // ✅ 1. useFocusEffect — resetar isPickingForForm ao entrar
  useFocusEffect(
    useCallback(() => {
      isPickingForForm.current = false; // ✅ garante reset ao focar
      const didShow = { current: false };

      loadData().then((svcs) => {
        if (
          !didShow.current &&
          !selectedQueueServiceRef.current &&
          svcs.length > 0
        ) {
          didShow.current = true;
          setShowServicePicker(true);
        }
      });

      return () => {
        didShow.current = false;
      };
    }, [loadData])
  );

  // ── ações ──────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setSelectedServiceId(null);
    setSelectedProfId(null);
    setDescription('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setFormProfessionals([]);
  };

  const handleSelectService = (serviceId: number) => {
  setSelectedQueueServiceId(serviceId);
  setShowServicePicker(false);

  if (isPickingForForm.current) {
    // veio do "+" → abre o formulário
    isPickingForForm.current = false;
    setSelectedServiceId(serviceId);
    setShowNewAppointment(true);
  }
  // veio da entrada na tela → só filtra a fila, não abre form
};

  const handleOpenForm = () => {
    if (!selectedQueueServiceRef.current) {
      // sem serviço selecionado → abre picker
      isPickingForForm.current = true;
      setShowServicePicker(true);
      return;
    }

    // ✅ já tem serviço → abre form diretamente, sem picker
    setSelectedServiceId(selectedQueueServiceRef.current);
    setShowNewAppointment(true);
  };

  
  const handleCreateAppointment = async () => {
    if (!selectedServiceId) {
      Alert.alert('Atenção', 'Selecione um serviço');
      return;
    }

    try {
      setLoading(true);

      const dateStr = getLocalDateString(selectedDate);
      const timeStr = selectedTime.toTimeString().split(' ')[0];

      const result = await createAppointment({
        service_id:      selectedServiceId,
        professional_id: selectedProfId ?? undefined,
        description:     description.trim() || undefined,
        scheduled_date:  dateStr,
        scheduled_time:  timeStr,
      });

      Alert.alert(
        'Agendamento criado!',
        `Posição na fila de ${selectedService?.name}: ${result.queue_position}`
      );
      setShowNewAppointment(false);
      resetForm();
      await loadData();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointmentId: number) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateAppointmentStatus(appointmentId, 'cancelado');
              Alert.alert('Sucesso', 'Agendamento cancelado');
              loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            }
          },
        },
      ]
    );
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
  <>
    {/* ✅ tela principal — só monta depois de ter serviço */}
    {selectedQueueServiceId ? (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.blue} />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => {
              isPickingForForm.current = false;
              setShowServicePicker(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.headerTitle}>Agendamentos</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Text style={{ fontSize: 12, color: theme.teal, fontWeight: '600' }}>
                {selectedQueueService?.name}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={14} color={theme.teal} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerAdd} onPress={handleOpenForm}>
            <MaterialIcons name="add" size={22} color={theme.blue} />
          </TouchableOpacity>
        </View>

        {/* ── Plantão Hoje ── */}
        {onDutyProfessionals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Plantão Hoje</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {onDutyProfessionals.map((p) => (
                <View key={p.id} style={styles.profChip}>
                  <View style={styles.profChipDot} />
                  <View>
                    <Text style={styles.profChipName}>{p.name}</Text>
                    <Text style={styles.profChipSpec}>{p.specialty}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Fila de Hoje ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>
              {`Fila — ${selectedQueueService?.name}`}
            </Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{filteredQueue.length}</Text>
            </View>
          </View>

          {/* chips de filtro */}
          {services.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {services.map((svc) => {
                const count  = todayQueue.filter(a => a.service_id === svc.id).length;
                const active = selectedQueueServiceId === svc.id;
                return (
                  <TouchableOpacity
                    key={svc.id}
                    style={[styles.serviceFilterChip, active && styles.serviceFilterChipActive]}
                    onPress={() => setSelectedQueueServiceId(svc.id)}
                  >
                    <Text style={[styles.serviceFilterChipText, active && styles.serviceFilterChipTextActive]}>
                      {svc.name}
                    </Text>
                    {count > 0 && (
                      <View style={[styles.serviceFilterBadge, active && { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                        <Text style={[styles.serviceFilterBadgeText, active && { color: '#fff' }]}>
                          {count}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {filteredQueue.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="event-available" size={40} color={theme.border} />
              <Text style={styles.emptyText}>
                Nenhum agendamento para este serviço hoje
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { marginTop: 12 }]}
                onPress={handleOpenForm}
              >
                <Text style={styles.emptyBtnText}>Ser o primeiro a agendar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredQueue.map((appointment) => {
              const isMe        = appointment.user_id === authUser?.id;
              const displayName = formatQueueName(appointment.user_name, isMe);
              return (
                <View key={appointment.id} style={[
                  styles.queueCard,
                  isMe && { borderColor: theme.blue + '60', borderWidth: 1.5 },
                ]}>
                  <View style={[styles.queuePositionBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Text style={styles.queuePositionText}>{appointment.queue_position}</Text>
                  </View>

                  <View style={styles.queueInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.queueName}>{displayName}</Text>
                      {isMe && (
                        <View style={[styles.youBadge, { backgroundColor: theme.blue + '20' }]}>
                          <Text style={[styles.youBadgeText, { color: theme.blue }]}>Você</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.queueService}>{appointment.service_name}</Text>
                    {appointment.professional_name ? (
                      <Text style={styles.queueProf}>{appointment.professional_name}</Text>
                    ) : null}
                    <View style={styles.queueMeta}>
                      <MaterialIcons name="access-time" size={13} color={theme.textMuted} />
                      <Text style={styles.queueTime}>{formatTime(appointment.scheduled_time)}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusPill, { backgroundColor: getStatusColor(appointment.status) + '22' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(appointment.status) }]} />
                    <Text style={[styles.statusPillText, { color: getStatusColor(appointment.status) }]}>
                      {getStatusLabel(appointment.status)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* ── Meus Agendamentos ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Meus Agendamentos</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{myAppointments.length}</Text>
            </View>
          </View>

          {myAppointments.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="calendar-today" size={40} color={theme.border} />
              <Text style={styles.emptyText}>Você não tem agendamentos ativos</Text>
            </View>
          ) : (
            myAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.apptCardTop}>
                  <Text style={styles.apptServiceLabel}>{appointment.service_name}</Text>
                  <View style={[styles.statusPill, { backgroundColor: getStatusColor(appointment.status) + '22' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(appointment.status) }]} />
                    <Text style={[styles.statusPillText, { color: getStatusColor(appointment.status) }]}>
                      {getStatusLabel(appointment.status)}
                    </Text>
                  </View>
                </View>

                {appointment.professional_name ? (
                  <View style={styles.apptProfRow}>
                    <MaterialIcons name="person-pin" size={14} color={theme.textMuted} />
                    <Text style={styles.apptMetaText}>{appointment.professional_name}</Text>
                  </View>
                ) : null}

                {appointment.description ? (
                  <Text style={styles.apptDescription}>{appointment.description}</Text>
                ) : null}

                <View style={styles.apptMetaRow}>
                  <View style={styles.apptMetaItem}>
                    <MaterialIcons name="calendar-today" size={14} color={theme.textMuted} />
                    <Text style={styles.apptMetaText}>{formatDate(appointment.scheduled_date)}</Text>
                  </View>
                  <View style={styles.apptMetaItem}>
                    <MaterialIcons name="access-time" size={14} color={theme.textMuted} />
                    <Text style={styles.apptMetaText}>{formatTime(appointment.scheduled_time)}</Text>
                  </View>
                  <View style={styles.apptMetaItem}>
                    <MaterialIcons name="format-list-numbered" size={14} color={theme.textMuted} />
                    <Text style={styles.apptMetaText}>Posição {appointment.queue_position}</Text>
                  </View>
                </View>

                {appointment.status === 'agendado' && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancelAppointment(appointment.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="cancel" size={16} color={theme.red} />
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    ) : (
      // ✅ tela vazia enquanto nenhum serviço selecionado
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 56 : 44,
            left: 20,
            zIndex: 10,
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    )}

    {/* ══════════════════════════════════════════
        MODAL — Escolher Serviço
        Sempre disponível independente do estado
    ══════════════════════════════════════════ */}
    <Modal
      visible={showServicePicker}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        isPickingForForm.current = false;
        if (selectedQueueServiceId) setShowServicePicker(false);
      }}
    >
      <View style={styles.modalWrapper}>
        <View style={styles.modalHeader}>
          {selectedQueueServiceId ? (
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => {
              isPickingForForm.current = false;
              setShowServicePicker(false);
            }}>
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => {
              isPickingForForm.current = false;
              navigation.goBack();
            }}>
              <MaterialIcons name="arrow-back" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          <Text style={styles.modalTitle}>
            {selectedQueueServiceId ? 'Trocar Serviço' : 'Escolher Serviço'}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.servicePickerSubtitle}>
            {selectedQueueServiceId
              ? 'Selecione outro serviço para ver a fila'
              : 'Selecione o serviço para ver a fila e agendar'}
          </Text>

          {services.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="medical-services" size={48} color={theme.border} />
              <Text style={styles.emptyText}>Nenhum serviço disponível no momento</Text>
            </View>
          ) : (
            services.map((svc) => {
              const queueCount = todayQueue.filter(a => a.service_id === svc.id).length;
              const isSelected = selectedQueueServiceId === svc.id;
              return (
                <TouchableOpacity
                  key={svc.id}
                  style={[
                    styles.servicePickerCard,
                    isSelected && {
                      borderColor: theme.teal,
                      borderWidth: 1.5,
                      backgroundColor: theme.teal + '08',
                    },
                  ]}
                  onPress={() => handleSelectService(svc.id)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.servicePickerIcon,
                    { backgroundColor: isSelected ? theme.teal + '30' : theme.teal + '20' },
                  ]}>
                    <MaterialIcons name="medical-services" size={28} color={theme.teal} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.servicePickerName}>{svc.name}</Text>
                      {isSelected && (
                        <View style={{
                          backgroundColor: theme.teal + '20',
                          borderRadius: 8,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                        }}>
                          <Text style={{ fontSize: 10, color: theme.teal, fontWeight: '700' }}>
                            Atual
                          </Text>
                        </View>
                      )}
                    </View>
                    {svc.description ? (
                      <Text style={styles.servicePickerDesc}>{svc.description}</Text>
                    ) : null}
                    <View style={styles.servicePickerMeta}>
                      <MaterialIcons name="access-time" size={12} color={theme.textMuted} />
                      <Text style={styles.servicePickerMetaText}>{svc.duration_min} min</Text>
                      <View style={styles.servicePickerMetaDot} />
                      <MaterialIcons name="people" size={12} color={theme.textMuted} />
                      <Text style={styles.servicePickerMetaText}>
                        {queueCount} na fila hoje
                      </Text>
                    </View>
                  </View>

                  <MaterialIcons
                    name={isSelected ? 'check-circle' : 'chevron-right'}
                    size={22}
                    color={isSelected ? theme.teal : theme.textMuted}
                  />
                </TouchableOpacity>
              );
            })
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>

    {/* ══════════════════════════════════════════
        MODAL — Formulário de Agendamento
    ══════════════════════════════════════════ */}
    <Modal
      visible={showNewAppointment}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => { setShowNewAppointment(false); resetForm(); }}
    >
      <View style={styles.modalWrapper}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => { setShowNewAppointment(false); resetForm(); }}
          >
            <MaterialIcons name="arrow-back" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {selectedService?.name ?? 'Agendamento'}
          </Text>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => { setShowNewAppointment(false); resetForm(); }}
          >
            <MaterialIcons name="close" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {selectedService && (
          <View style={[
            styles.serviceBanner,
            { backgroundColor: theme.teal + '15', borderColor: theme.teal + '30' },
          ]}>
            <MaterialIcons name="medical-services" size={18} color={theme.teal} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceBannerName, { color: theme.teal }]}>
                {selectedService.name}
              </Text>
              {selectedService.description ? (
                <Text style={styles.serviceBannerDesc}>{selectedService.description}</Text>
              ) : null}
            </View>
            <View style={[styles.serviceBannerDuration, { backgroundColor: theme.teal + '20' }]}>
              <Text style={[styles.serviceBannerDurationText, { color: theme.teal }]}>
                {selectedService.duration_min} min
              </Text>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.modalScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profissional */}
          {formProfessionals.length === 0 ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Profissional</Text>
              <View style={[styles.emptyCard, { paddingVertical: 16 }]}>
                <MaterialIcons name="person-off" size={24} color={theme.textMuted} />
                <Text style={styles.emptyText}>
                  Nenhum profissional de plantão para este serviço
                </Text>
              </View>
            </View>
          ) : formProfessionals.length === 1 ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Profissional</Text>
              <View style={styles.profAutoCard}>
                <MaterialIcons name="person-pin" size={20} color={theme.teal} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.profAutoName}>{formProfessionals[0].name}</Text>
                  <Text style={styles.profAutoSpec}>{formProfessionals[0].specialty}</Text>
                </View>
                <View style={styles.profAutoTag}>
                  <Text style={styles.profAutoTagText}>Auto</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Escolher Especialista</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedProfId}
                  onValueChange={(v) => setSelectedProfId(v)}
                  style={styles.picker}
                  dropdownIconColor={theme.textSecondary}
                >
                  <Picker.Item label="Sem preferência" value={null} />
                  {formProfessionals.map((p) => (
                    <Picker.Item
                      key={p.id}
                      label={`${p.name} — ${p.specialty}${p.on_duty ? ' 🟢' : ''}`}
                      value={p.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* Descrição */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descrição (opcional)</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva brevemente o que precisa..."
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Data */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Data</Text>
            <TouchableOpacity
              style={styles.datePickerBtn}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="calendar-today" size={18} color={theme.blue} />
              <Text style={styles.datePickerText}>
                {selectedDate.toLocaleDateString('pt-BR')}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Horário */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Horário Preferencial</Text>
            <TouchableOpacity
              style={styles.datePickerBtn}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="access-time" size={18} color={theme.blue} />
              <Text style={styles.datePickerText}>
                {selectedTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoBox}>
            <MaterialIcons name="info-outline" size={18} color={theme.blue} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.infoTitle}>Informações Importantes</Text>
              <Text style={styles.infoText}>
                {'• Fila separada por serviço\n'}
                {'• Atendimento por ordem de chegada\n'}
                {'• Chegue com 10 min de antecedência\n'}
                {'• Em caso de atraso você pode perder a vez'}
              </Text>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => { setShowNewAppointment(false); resetForm(); }}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalConfirmBtn, loading && { opacity: 0.6 }]}
              onPress={handleCreateAppointment}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.modalConfirmText}>Agendar</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={(() => {
            const d = new Date();
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
          })()}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(
              new Date(date.getFullYear(), date.getMonth(), date.getDate())
            );
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={(_, time) => {
            setShowTimePicker(false);
            if (time) setSelectedTime(time);
          }}
        />
      )}
    </Modal>
  </>
);
}