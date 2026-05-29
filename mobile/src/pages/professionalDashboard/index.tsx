import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, RefreshControl, Switch, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { makeStyles } from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  ProfessionalProfile,
  ScheduleDay,
  getMyProfessionalProfile,
  getMyProfessionalAppointments,
  getMySchedule,
  getMyQueue,
  toggleMyDuty,
  sendPrescription,
  setDelay,
  getSpecialtiesForPortal,
  updateMySpecialty,
  Specialty,
  getServicesForPortal,
  updateMyServices,
} from '../../api/professionalPortal';

export default function ProfessionalDashboard() {
  const navigation        = useNavigation();
  const { theme }         = useTheme();
  const { user, signOut } = useAuth();
  const styles            = makeStyles(theme);

  // ── dados ──────────────────────────────────────────────────────────────────
  const [profile,      setProfile]      = useState<ProfessionalProfile | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [schedule,     setSchedule]     = useState<ScheduleDay[]>([]);
  const [queue,        setQueue]        = useState<any[]>([]);
  const [refreshing,   setRefreshing]   = useState(false);

  // ── plantão ────────────────────────────────────────────────────────────────
  const [togglingDuty, setTogglingDuty] = useState(false);

  // ── receita ────────────────────────────────────────────────────────────────
  const [showPrescription,    setShowPrescription]    = useState(false);
  const [selectedAppt,        setSelectedAppt]        = useState<any | null>(null);
  const [prescriptionText,    setPrescriptionText]    = useState('');
  const [sendingPrescription, setSendingPrescription] = useState(false);

  // ── atraso ─────────────────────────────────────────────────────────────────
  const [showDelay,     setShowDelay]     = useState(false);
  const [delayMinutes,  setDelayMinutes]  = useState('15');
  const [settingDelay,  setSettingDelay]  = useState(false);



  const [showSpecialty, setShowSpecialty]   = useState(false);
  const [specialties, setSpecialties]       = useState<Specialty[]>([]);
  const [selectedSpecId, setSelectedSpecId] = useState<number | null>(null);
  const [savingSpec, setSavingSpec]         = useState(false);


  const [showServices,      setShowServices]      = useState(false);
  const [availableServices, setAvailableServices] = useState<{ id: number; name: string; duration_min: number }[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [savingServices,    setSavingServices]    = useState(false);

  // ── load ───────────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [prof, appts, sched, q] = await Promise.all([
        getMyProfessionalProfile(),
        getMyProfessionalAppointments(),
        getMySchedule(),
        getMyQueue(),
      ]);
      setProfile(prof);
      setAppointments(appts);
      setSchedule(sched);
      setQueue(q);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ── ações ──────────────────────────────────────────────────────────────────

  const handleToggleDuty = async () => {
    setTogglingDuty(true);
    try {
      const result = await toggleMyDuty();
      setProfile(prev => prev ? { ...prev, on_duty: result.on_duty } : prev);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setTogglingDuty(false);
    }
  };

  const handleSendPrescription = async () => {
    if (!prescriptionText.trim() || !selectedAppt) return;
    setSendingPrescription(true);
    try {
      await sendPrescription({
        appointment_id: selectedAppt.id,
        content:        prescriptionText.trim(),
      });
      Alert.alert('✅ Receita enviada!', `Enviada para ${selectedAppt.user_name}`);
      setShowPrescription(false);
      setPrescriptionText('');
      setSelectedAppt(null);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSendingPrescription(false);
    }
  };

  const handleSetDelay = async () => {
    const mins = parseInt(delayMinutes, 10);
    if (isNaN(mins) || mins < 1) {
      Alert.alert('Atenção', 'Informe um número válido de minutos');
      return;
    }

    Alert.alert(
      'Confirmar atraso',
      `Adicionar ${mins} minutos a todos os agendamentos futuros de hoje?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            setSettingDelay(true);
            try {
              const result = await setDelay(mins);
              Alert.alert(
                '✅ Fila atualizada',
                `${result.affected} agendamento(s) adiado(s) em ${mins} minutos.`
              );
              setShowDelay(false);
              setDelayMinutes('15');
              await loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            } finally {
              setSettingDelay(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' as any }] });
        },
      },
    ]);
  };


  const handleOpenSpecialty = async () => {
  try {
    const specs = await getSpecialtiesForPortal();
    setSpecialties(specs);
    setSelectedSpecId(profile?.specialty_id ?? null);
    setShowSpecialty(true);
  } catch (error: any) {
    Alert.alert('Erro', error.message);
  }
};

const handleSaveSpecialty = async () => {
  if (!selectedSpecId) {
    Alert.alert('Atenção', 'Selecione uma especialidade');
    return;
  }
  setSavingSpec(true);
  try {
    await updateMySpecialty(selectedSpecId);
    Alert.alert('✅ Especialidade atualizada!');
    setShowSpecialty(false);
    await loadData();
  } catch (error: any) {
    Alert.alert('Erro', error.message);
  } finally {
    setSavingSpec(false);
  }
};


const handleOpenServices = async () => {
  try {
    const svcs = await getServicesForPortal();
    setAvailableServices(svcs);
    // ✅ pré-selecionar os serviços que já atende
    const currentNames = profile?.service_names ?? [];
    const currentIds = svcs
      .filter(s => currentNames.includes(s.name))
      .map(s => s.id);
    setSelectedServiceIds(currentIds);
    setShowServices(true);
  } catch (error: any) {
    Alert.alert('Erro', error.message);
  }
};

const handleToggleService = (id: number) => {
  setSelectedServiceIds(prev =>
    prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
  );
};

const handleSaveServices = async () => {
  setSavingServices(true);
  try {
    await updateMyServices(selectedServiceIds);
    Alert.alert('✅ Serviços atualizados!');
    setShowServices(false);
    await loadData();
  } catch (error: any) {
    Alert.alert('Erro', error.message);
  } finally {
    setSavingServices(false);
  }
};

  // ── helpers ────────────────────────────────────────────────────────────────

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'short', day: '2-digit', month: '2-digit',
    });

  const formatTime = (t: string) => t.substring(0, 5);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
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
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Bem-vindo,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            {profile && (
              <Text style={styles.specialty}>{profile.specialty_name}</Text>
            )}
            <View style={styles.badge}>
              <MaterialIcons name="medical-services" size={12} color={theme.blue} />
              <Text style={styles.badgeText}>ESPECIALISTA</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
            <MaterialIcons name="logout" size={22} color={theme.red} />
          </TouchableOpacity>
        </View>

        {/* ── Status de Plantão ── */}
        {profile && (
          <View style={[
            styles.dutyCard,
            { borderColor: profile.on_duty ? theme.green + '60' : theme.border },
          ]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dutyTitle}>
                {profile.on_duty ? '🟢 Você está de plantão' : '⚫ Fora de plantão'}
              </Text>
              <Text style={styles.dutySubtitle}>
                {profile.on_duty
                  ? 'Pacientes podem te ver nos agendamentos'
                  : 'Ative para aparecer disponível'}
              </Text>
            </View>
            <Switch
              value={Boolean(profile.on_duty)}
              onValueChange={handleToggleDuty}
              disabled={togglingDuty}
              trackColor={{ false: theme.border, true: theme.green + '60' }}
              thumbColor={profile.on_duty ? theme.green : theme.textMuted}
            />
          </View>
        )}

        {/* ── Resumo ── */}
        {profile && (
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: theme.blue }]}>
                {appointments.length}
              </Text>
              <Text style={styles.summaryLabel}>Próximos</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: theme.teal }]}>
                {profile.service_names.length}
              </Text>
              <Text style={styles.summaryLabel}>Serviços</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: theme.yellow }]}>
                {schedule.length}
              </Text>
              <Text style={styles.summaryLabel}>Dias c/ agenda</Text>
            </View>
          </View>
        )}

        {/* ── Ações Rápidas ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              backgroundColor: theme.yellow + '20',
              borderRadius: 12, paddingVertical: 14,
              borderWidth: 1, borderColor: theme.yellow + '40',
            }}
            onPress={() => setShowDelay(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="schedule" size={20} color={theme.yellow} />
            <Text style={{ fontWeight: '700', fontSize: 14, color: theme.yellow }}>
              Sinalizar Atraso
            </Text>
          </TouchableOpacity>

           {/* ✅ botão especialidade */}
          <TouchableOpacity
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              backgroundColor: theme.purple + '20',
              borderRadius: 12, paddingVertical: 14,
              borderWidth: 1, borderColor: theme.purple + '40',
            }}
            onPress={handleOpenSpecialty}
            activeOpacity={0.8}
          >
            <MaterialIcons name="local-hospital" size={20} color={theme.purple} />
            <Text style={{ fontWeight: '700', fontSize: 14, color: theme.purple }}>
              Especialidade
            </Text>
          </TouchableOpacity>

          {/* ✅ botão serviços */}
          <TouchableOpacity
            style={{
              flex: 1, flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              backgroundColor: theme.teal + '20',
              borderRadius: 12, paddingVertical: 14,
              borderWidth: 1, borderColor: theme.teal + '40',
            }}
            onPress={handleOpenServices}
            activeOpacity={0.8}
          >
            <MaterialIcons name="medical-services" size={20} color={theme.teal} />
            <Text style={{ fontWeight: '700', fontSize: 14, color: theme.teal }}>
              Meus Serviços
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Fila da Especialidade Hoje ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fila da Especialidade — Hoje</Text>
          {queue.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="people" size={40} color={theme.border} />
              <Text style={styles.emptyText}>Nenhum paciente na fila hoje</Text>
            </View>
          ) : (
            queue.map((appt, index) => (
              <View key={appt.id} style={[
                styles.apptCard,
                appt.status === 'em_atendimento' && {
                  borderColor: theme.yellow + '80', borderWidth: 1.5,
                },
              ]}>
                {/* posição */}
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: appt.status === 'em_atendimento' ? theme.yellow : theme.blue,
                  justifyContent: 'center', alignItems: 'center', flexShrink: 0,
                }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
                    {index + 1}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.apptPatient}>{appt.user_name}</Text>
                  <Text style={styles.apptService}>{appt.service_name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MaterialIcons name="access-time" size={12} color={theme.textMuted} />
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>
                      {formatTime(appt.scheduled_time)}
                    </Text>
                    {appt.professional_name && (
                      <Text style={{ fontSize: 12, color: theme.teal }}>
                        · {appt.professional_name}
                      </Text>
                    )}
                  </View>
                </View>

                {/* botão receita — só para agendamentos do próprio profissional */}
                {appt.professional_id === profile?.id && (
                  <TouchableOpacity
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: theme.teal + '20',
                      justifyContent: 'center', alignItems: 'center',
                    }}
                    onPress={() => {
                      setSelectedAppt(appt);
                      setShowPrescription(true);
                    }}
                  >
                    <MaterialIcons name="description" size={18} color={theme.teal} />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* ── Próximos Atendimentos ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Atendimentos</Text>
          {appointments.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="event-available" size={40} color={theme.border} />
              <Text style={styles.emptyText}>Nenhum atendimento agendado</Text>
            </View>
          ) : (
            appointments.map((appt) => (
              <View key={appt.id} style={styles.apptCard}>
                <View style={[styles.apptTimeBadge, { backgroundColor: theme.blue + '20' }]}>
                  <Text style={[styles.apptTime, { color: theme.blue }]}>
                    {formatTime(appt.scheduled_time)}
                  </Text>
                  <Text style={[styles.apptDate, { color: theme.textMuted }]}>
                    {formatDate(appt.scheduled_date)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.apptPatient}>{appt.user_name}</Text>
                  <Text style={styles.apptService}>{appt.service_name}</Text>
                  {appt.description ? (
                    <Text style={styles.apptDesc}>{appt.description}</Text>
                  ) : null}
                </View>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: appt.status === 'em_atendimento' ? theme.yellow : theme.green },
                ]} />
              </View>
            ))
          )}
        </View>

        {/* ── Agenda 30 dias ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agenda — Próximos 30 dias</Text>
          {schedule.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="calendar-today" size={40} color={theme.border} />
              <Text style={styles.emptyText}>Nenhum dia com agenda</Text>
            </View>
          ) : (
            schedule.map((day) => (
              <View key={day.date} style={styles.scheduleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scheduleDate}>{formatDate(day.date)}</Text>
                  <Text style={styles.scheduleSub}>
                    {day.total} consulta{day.total !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.scheduleStats}>
                  {day.agendados > 0 && (
                    <View style={[styles.scheduleBadge, { backgroundColor: theme.blue + '20' }]}>
                      <Text style={[styles.scheduleBadgeText, { color: theme.blue }]}>
                        {day.agendados} ag.
                      </Text>
                    </View>
                  )}
                  {day.em_atendimento > 0 && (
                    <View style={[styles.scheduleBadge, { backgroundColor: theme.yellow + '20' }]}>
                      <Text style={[styles.scheduleBadgeText, { color: theme.yellow }]}>
                        {day.em_atendimento} at.
                      </Text>
                    </View>
                  )}
                  {day.concluidos > 0 && (
                    <View style={[styles.scheduleBadge, { backgroundColor: theme.green + '20' }]}>
                      <Text style={[styles.scheduleBadgeText, { color: theme.green }]}>
                        {day.concluidos} ✓
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* ── Serviços que atendo ── */}
        {profile && profile.service_names.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serviços que Atendo</Text>
            <View style={styles.servicesWrap}>
              {profile.service_names.map((name, i) => (
                <View key={i} style={[styles.serviceChip, { backgroundColor: theme.teal + '20' }]}>
                  <MaterialIcons name="medical-services" size={13} color={theme.teal} />
                  <Text style={[styles.serviceChipText, { color: theme.teal }]}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
          MODAL — Receita
      ══════════════════════════════════════════ */}
      <Modal
        visible={showPrescription}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowPrescription(false);
          setPrescriptionText('');
          setSelectedAppt(null);
        }}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => {
                setShowPrescription(false);
                setPrescriptionText('');
                setSelectedAppt(null);
              }}
            >
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enviar Receita</Text>
            <View style={{ width: 36 }} />
          </View>

          {selectedAppt && (
            <ScrollView
              style={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* banner paciente */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                backgroundColor: theme.teal + '15', borderRadius: 12,
                padding: 14, marginBottom: 20,
                borderWidth: 1, borderColor: theme.teal + '30',
              }}>
                <MaterialIcons name="person" size={20} color={theme.teal} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: theme.teal }}>
                    {selectedAppt.user_name}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                    {selectedAppt.service_name}
                  </Text>
                </View>
              </View>

              <Text style={[styles.inputLabel, { marginBottom: 8 }]}>
                Conteúdo da Receita
              </Text>
              <TextInput
                style={[styles.textArea, { minHeight: 180 }]}
                value={prescriptionText}
                onChangeText={setPrescriptionText}
                placeholder="Descreva os medicamentos, dosagens e instruções..."
                placeholderTextColor={theme.textMuted}
                multiline
                textAlignVertical="top"
              />

              <View style={[styles.modalActions, { marginTop: 20 }]}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => {
                    setShowPrescription(false);
                    setPrescriptionText('');
                    setSelectedAppt(null);
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalConfirmBtn,
                    { backgroundColor: theme.teal },
                    sendingPrescription && { opacity: 0.6 },
                  ]}
                  onPress={handleSendPrescription}
                  disabled={sendingPrescription}
                  activeOpacity={0.8}
                >
                  {sendingPrescription ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <MaterialIcons name="send" size={16} color="#fff" />
                      <Text style={styles.modalConfirmText}>Enviar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* ══════════════════════════════════════════
          MODAL — Atraso
      ══════════════════════════════════════════ */}
      <Modal
        visible={showDelay}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDelay(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowDelay(false)}
            >
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sinalizar Atraso</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* aviso */}
            <View style={{
              flexDirection: 'row', alignItems: 'flex-start', gap: 12,
              backgroundColor: theme.yellow + '15', borderRadius: 12,
              padding: 14, marginBottom: 20,
              borderWidth: 1, borderColor: theme.yellow + '30',
            }}>
              <MaterialIcons name="warning" size={18} color={theme.yellow} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.yellow, marginBottom: 4 }}>
                  Como funciona
                </Text>
                <Text style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 18 }}>
                  Os minutos informados serão somados a todos os agendamentos futuros de hoje da sua especialidade, reordenando a fila automaticamente.
                </Text>
              </View>
            </View>

            <Text style={[styles.inputLabel, { marginBottom: 12 }]}>
              Quantos minutos de atraso?
            </Text>

            {/* botões rápidos */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {['5', '10', '15', '20', '30'].map(m => (
                <TouchableOpacity
                  key={m}
                  style={{
                    flex: 1, paddingVertical: 12, borderRadius: 10,
                    alignItems: 'center', borderWidth: 1,
                    borderColor: delayMinutes === m ? theme.yellow : theme.border,
                    backgroundColor: delayMinutes === m ? theme.yellow + '20' : theme.surface,
                  }}
                  onPress={() => setDelayMinutes(m)}
                >
                  <Text style={{
                    fontWeight: '700', fontSize: 13,
                    color: delayMinutes === m ? theme.yellow : theme.textMuted,
                  }}>
                    {m}min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* input personalizado */}
            <View style={[styles.inputRow, { marginBottom: 16 }]}>
              <MaterialIcons name="schedule" size={18} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={delayMinutes}
                onChangeText={setDelayMinutes}
                keyboardType="numeric"
                placeholder="Minutos personalizados"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* preview de impacto */}
            {queue.length > 0 && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 10,
                backgroundColor: theme.surface, borderRadius: 10,
                padding: 12, marginBottom: 20,
                borderWidth: 1, borderColor: theme.border,
              }}>
                <MaterialIcons name="people" size={16} color={theme.textMuted} />
                <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                  {queue.filter(a => a.status === 'agendado').length} paciente(s) serão afetados hoje
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDelay(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  { backgroundColor: theme.yellow },
                  settingDelay && { opacity: 0.6 },
                ]}
                onPress={handleSetDelay}
                disabled={settingDelay}
                activeOpacity={0.8}
              >
                {settingDelay ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="schedule" size={16} color="#fff" />
                    <Text style={styles.modalConfirmText}>Aplicar Atraso</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
      {/* ══════════════════════════════════════════
          MODAL — Especialidade
      ══════════════════════════════════════════ */}
      <Modal
        visible={showSpecialty}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSpecialty(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSpecialty(false)}
            >
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Minha Especialidade</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* especialidade atual */}
            {profile?.specialty_name && profile.specialty_name !== 'Sem especialidade' && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 10,
                backgroundColor: theme.teal + '15', borderRadius: 12,
                padding: 14, marginBottom: 20,
                borderWidth: 1, borderColor: theme.teal + '30',
              }}>
                <MaterialIcons name="local-hospital" size={18} color={theme.teal} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>
                    Atual
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: theme.teal }}>
                    {profile.specialty_name}
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.inputLabel, { marginBottom: 12 }]}>
              Selecione sua especialidade
            </Text>

            {specialties.map((spec) => {
              const selected = selectedSpecId === spec.id;
              return (
                <TouchableOpacity
                  key={spec.id}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                    backgroundColor: selected ? theme.purple + '15' : theme.surface,
                    borderRadius: 12, padding: 14, marginBottom: 8,
                    borderWidth: 1,
                    borderColor: selected ? theme.purple : theme.border,
                  }}
                  onPress={() => setSelectedSpecId(spec.id)}
                  activeOpacity={0.8}
                >
                  <View style={{
                    width: 20, height: 20, borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selected ? theme.purple : theme.border,
                    backgroundColor: selected ? theme.purple : 'transparent',
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    {selected && (
                      <View style={{
                        width: 8, height: 8, borderRadius: 4,
                        backgroundColor: '#fff',
                      }} />
                    )}
                  </View>
                  <Text style={{
                    fontSize: 14, flex: 1,
                    fontWeight: selected ? '700' : '400',
                    color: selected ? theme.purple : theme.textPrimary,
                  }}>
                    {spec.name}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={[styles.modalActions, { marginTop: 20 }]}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowSpecialty(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  { backgroundColor: theme.purple },
                  savingSpec && { opacity: 0.6 },
                ]}
                onPress={handleSaveSpecialty}
                disabled={savingSpec}
                activeOpacity={0.8}
              >
                {savingSpec ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="check" size={16} color="#fff" />
                    <Text style={styles.modalConfirmText}>Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════
          MODAL — Serviços
      ══════════════════════════════════════════ */}
      <Modal
        visible={showServices}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowServices(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowServices(false)}
            >
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Meus Serviços</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 16 }}>
              Selecione os serviços que você atende. Apenas estes aparecerão para os pacientes.
            </Text>

            {availableServices.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialIcons name="medical-services" size={40} color={theme.border} />
                <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
              </View>
            ) : (
              availableServices.map((svc) => {
                const selected = selectedServiceIds.includes(svc.id);
                return (
                  <TouchableOpacity
                    key={svc.id}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12,
                      backgroundColor: selected ? theme.teal + '15' : theme.surface,
                      borderRadius: 12, padding: 14, marginBottom: 8,
                      borderWidth: 1,
                      borderColor: selected ? theme.teal : theme.border,
                    }}
                    onPress={() => handleToggleService(svc.id)}
                    activeOpacity={0.8}
                  >
                    {/* checkbox */}
                    <View style={{
                      width: 22, height: 22, borderRadius: 6,
                      borderWidth: 2,
                      borderColor: selected ? theme.teal : theme.border,
                      backgroundColor: selected ? theme.teal : 'transparent',
                      justifyContent: 'center', alignItems: 'center',
                    }}>
                      {selected && (
                        <MaterialIcons name="check" size={14} color="#fff" />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 14, fontWeight: selected ? '700' : '400',
                        color: selected ? theme.teal : theme.textPrimary,
                      }}>
                        {svc.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                        {svc.duration_min} min
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            {/* contador */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: theme.surface, borderRadius: 10,
              padding: 12, marginTop: 8, marginBottom: 20,
              borderWidth: 1, borderColor: theme.border,
            }}>
              <MaterialIcons name="info-outline" size={16} color={theme.textMuted} />
              <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                {selectedServiceIds.length} serviço(s) selecionado(s)
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowServices(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  { backgroundColor: theme.teal },
                  savingServices && { opacity: 0.6 },
                ]}
                onPress={handleSaveServices}
                disabled={savingServices}
                activeOpacity={0.8}
              >
                {savingServices ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="check" size={16} color="#fff" />
                    <Text style={styles.modalConfirmText}>Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}