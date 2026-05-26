import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { styles } from './styles';
import {
  createAppointment,
  getUserAppointments,
  getAppointmentsByDate,
  cancelAppointmentById,
  SERVICE_TYPES,
  Appointment,
} from '../../database/services/servicesAppointments';
import { RootStackParamList, UserData } from '../../routers/types';
import database from '../../database';

type AppointmentsScreenRouteProp = RouteProp<RootStackParamList, 'Appointments'>;

export default function Appointments() {
  const navigation = useNavigation();
  const route      = useRoute<AppointmentsScreenRouteProp>();
  const { user }   = route.params as { user: UserData };

  // ── estados ────────────────────────────────────────────────────────────────
  const [refreshing, setRefreshing]               = useState(false);
  const [loading, setLoading]                     = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  // form
  const [serviceType, setServiceType]   = useState(SERVICE_TYPES[0].value);
  const [description, setDescription]   = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // dados
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [todayQueue, setTodayQueue]         = useState<Appointment[]>([]);

  // ── helpers ────────────────────────────────────────────────────────────────

  // ✅ Data local — evita bug de timezone (UTC vs Brasil)
  const getLocalDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');

  const formatTime = (t: string) => t.substring(0, 5);

  const getServiceLabel = (value: string) =>
    SERVICE_TYPES.find((s) => s.value === value)?.label ?? value;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':        return '#3b82f6';
      case 'em_atendimento':  return '#f59e0b';
      case 'concluido':       return '#10b981';
      case 'cancelado':       return '#ef4444';
      default:                return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado':        return 'Agendado';
      case 'em_atendimento':  return 'Em Atendimento';
      case 'concluido':       return 'Concluído';
      case 'cancelado':       return 'Cancelado';
      default:                return status;
    }
  };

  // ── dados ──────────────────────────────────────────────────────────────────

  const loadData = () => {
    try {
      // ── DEBUG: confirmar o que está salvo no banco ──
      const allAppts = database.getAllSync<{
        id: number;
        scheduled_date: string;
        scheduled_time: string;
        status: string;
        user_name: string;
      }>('SELECT id, scheduled_date, scheduled_time, status, user_name FROM appointments');
      console.log('📦 Appointments no banco:', JSON.stringify(allAppts));
      // ───────────────────────────────────────────────

      // ✅ CORRIGIDO: data local em vez de UTC
      const today = getLocalDateString(new Date());
      console.log('📅 Buscando fila para:', today);

      setMyAppointments(getUserAppointments(user.id));

      const all = getAppointmentsByDate(today);

      // Admin vê tudo; usuário comum vê apenas fila ativa
      const queue = user.role === 'admin'
        ? all
        : all.filter(
            (a) => a.status === 'agendado' || a.status === 'em_atendimento'
          );

      console.log(`📋 Hoje (local): ${today} — ${queue.length} na fila`);
      setTodayQueue(queue);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  useEffect(() => { loadData(); }, []);

  // ── ações ──────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setServiceType(SERVICE_TYPES[0].value);
    setDescription('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  const handleCreateAppointment = () => {
    if (!description.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição do atendimento');
      return;
    }

    try {
      setLoading(true);

      // ✅ CORRIGIDO: data local — sem drift de UTC
      const dateStr = getLocalDateString(selectedDate);
      const timeStr = selectedTime.toTimeString().split(' ')[0];

      console.log(`📅 Agendando para: ${dateStr} às ${timeStr}`);

      const appointmentId = createAppointment(
        user.id,
        user.name,
        user.email,
        serviceType,
        description,
        dateStr,
        timeStr
      );

      if (appointmentId) {
        Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
        setShowNewAppointment(false);
        resetForm();
        loadData();
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointmentId: number) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            if (cancelAppointmentById(appointmentId)) {
              Alert.alert('Sucesso', 'Agendamento cancelado');
              loadData();
            } else {
              Alert.alert('Erro', 'Não foi possível cancelar');
            }
          },
        },
      ]
    );
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendamentos</Text>
          <TouchableOpacity
            style={styles.headerAdd}
            onPress={() => setShowNewAppointment(true)}
          >
            <MaterialIcons name="add" size={22} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* ── Fila de Hoje ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Fila de Hoje</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{todayQueue.length}</Text>
            </View>
          </View>

          {todayQueue.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="event-available" size={40} color="#334155" />
              <Text style={styles.emptyText}>Nenhum agendamento hoje</Text>
            </View>
          ) : (
            todayQueue.map((appointment) => (
              <View key={appointment.id} style={styles.queueCard}>
                <View
                  style={[
                    styles.queuePositionBadge,
                    { backgroundColor: getStatusColor(appointment.status) },
                  ]}
                >
                  <Text style={styles.queuePositionText}>
                    {appointment.queue_position}
                  </Text>
                </View>

                <View style={styles.queueInfo}>
                  <Text style={styles.queueName}>{appointment.user_name}</Text>
                  <Text style={styles.queueService}>
                    {getServiceLabel(appointment.service_type)}
                  </Text>
                  <View style={styles.queueMeta}>
                    <MaterialIcons name="access-time" size={13} color="#64748b" />
                    <Text style={styles.queueTime}>
                      {formatTime(appointment.scheduled_time)}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: getStatusColor(appointment.status) + '22' },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(appointment.status) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: getStatusColor(appointment.status) },
                    ]}
                  >
                    {getStatusLabel(appointment.status)}
                  </Text>
                </View>
              </View>
            ))
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
              <MaterialIcons name="calendar-today" size={40} color="#334155" />
              <Text style={styles.emptyText}>Você não tem agendamentos ativos</Text>
            </View>
          ) : (
            myAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.apptCardTop}>
                  <Text style={styles.apptServiceLabel}>
                    {getServiceLabel(appointment.service_type)}
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: getStatusColor(appointment.status) + '22' },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(appointment.status) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: getStatusColor(appointment.status) },
                      ]}
                    >
                      {getStatusLabel(appointment.status)}
                    </Text>
                  </View>
                </View>

                {appointment.description ? (
                  <Text style={styles.apptDescription}>
                    {appointment.description}
                  </Text>
                ) : null}

                <View style={styles.apptMetaRow}>
                  <View style={styles.apptMetaItem}>
                    <MaterialIcons name="calendar-today" size={14} color="#64748b" />
                    <Text style={styles.apptMetaText}>
                      {formatDate(appointment.scheduled_date)}
                    </Text>
                  </View>
                  <View style={styles.apptMetaItem}>
                    <MaterialIcons name="access-time" size={14} color="#64748b" />
                    <Text style={styles.apptMetaText}>
                      {formatTime(appointment.scheduled_time)}
                    </Text>
                  </View>
                  <View style={styles.apptMetaItem}>
                    <MaterialIcons name="format-list-numbered" size={14} color="#64748b" />
                    <Text style={styles.apptMetaText}>
                      Posição {appointment.queue_position}
                    </Text>
                  </View>
                </View>

                {appointment.status === 'agendado' && (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancelAppointment(appointment.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="cancel" size={16} color="#ef4444" />
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
          MODAL — Novo Agendamento
      ══════════════════════════════════════════ */}
      <Modal
        visible={showNewAppointment}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewAppointment(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => { setShowNewAppointment(false); resetForm(); }}
            >
              <MaterialIcons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Agendamento</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Tipo de Serviço */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Serviço</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={serviceType}
                  onValueChange={setServiceType}
                  style={styles.picker}
                  dropdownIconColor="#94a3b8"
                >
                  {SERVICE_TYPES.map((s) => (
                    <Picker.Item key={s.value} label={s.label} value={s.value} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva brevemente o que precisa..."
                placeholderTextColor="#475569"
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
                <MaterialIcons name="calendar-today" size={18} color="#3b82f6" />
                <Text style={styles.datePickerText}>
                  {selectedDate.toLocaleDateString('pt-BR')}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748b" />
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
                <MaterialIcons name="access-time" size={18} color="#3b82f6" />
                <Text style={styles.datePickerText}>
                  {selectedTime.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Info box */}
            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={18} color="#3b82f6" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.infoTitle}>Informações Importantes</Text>
                <Text style={styles.infoText}>
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
                <Text style={styles.modalConfirmText}>
                  {loading ? 'Criando...' : 'Agendar'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>

       {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            minimumDate={(() => {
              const d = new Date();
              // ✅ Meia-noite local — evita UTC empurrar para o próximo dia
              return new Date(d.getFullYear(), d.getMonth(), d.getDate());
            })()}
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) {
                // ✅ Preserva data local sem drift de UTC
                const local = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                );
                setSelectedDate(local);
              }
            }}
          />
        )}

        {/* Time Picker */}
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