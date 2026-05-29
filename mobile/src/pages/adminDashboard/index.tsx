import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routers/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { makeStyles } from './styles';
import { useQueue } from '../../hooks/useQueue';
import {
  Appointment,
  AppointmentStats,
  getAppointmentHistory,
  getAppointmentStats,
  updateAppointmentStatus,
} from '../../api/appointments';
import {
  Professional,
  getOnDutyProfessionals,
} from '../../api/professionals';

type AdminDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
type AdminDashboardScreenRouteProp      = RouteProp<RootStackParamList, 'AdminDashboard'>;

const getLocalDateString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function AdminDashboard() {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  const route      = useRoute<AdminDashboardScreenRouteProp>();
  const { theme, isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const styles = makeStyles(theme);

  const { user } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(false);

  const [appointmentStats, setAppointmentStats] = useState<AppointmentStats>({
    total: 0, agendados: 0, em_atendimento: 0, concluidos: 0, hoje: 0,
  });

  const [appointmentsHistory, setAppointmentsHistory] = useState<Appointment[]>([]);
  const [onDutyProfessionals, setOnDutyProfessionals] = useState<Professional[]>([]);

  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal]           = useState(false);

  // ✅ polling automático a cada 10s — substitui loadStats manual
  const { queue, refresh: refreshQueue } = useQueue({ pollingInterval: 10000 });

  // ✅ fila ativa derivada do queue — sem estado separado
  const activeAppointments = queue.filter(
    a => a.status === 'agendado' || a.status === 'em_atendimento'
  );

  // ── helpers ────────────────────────────────────────────────────────────────

  const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

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

  // ── dados extras: stats + plantão ─────────────────────────────────────────

  const loadExtras = useCallback(async () => {
    try {
      const [stats, professionals] = await Promise.all([
        getAppointmentStats(),
        getOnDutyProfessionals(),
      ]);
      setAppointmentStats(stats);
      setOnDutyProfessionals(professionals);
    } catch (error: any) {
      console.error('Erro ao carregar extras:', error.message);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshQueue(), loadExtras()]);
    setRefreshing(false);
  };

  // ✅ recarrega ao focar (volta de AdminServices/AdminProfessionals)
  useFocusEffect(
    useCallback(() => {
      loadExtras();
    }, [loadExtras])
  );

  // ── histórico ──────────────────────────────────────────────────────────────

  const handleShowHistory = async () => {
    try {
      setLoading(true);
      const history = await getAppointmentHistory();
      setAppointmentsHistory(history);
      setShowHistoryModal(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    } finally {
      setLoading(false);
    }
  };

  // ── ações de agendamento ───────────────────────────────────────────────────

  const handleUpdateStatus = (
    appointmentId: number,
    newStatus: 'em_atendimento' | 'concluido' | 'cancelado'
  ) => {
    const labels: Record<string, string> = {
      em_atendimento: 'Iniciar atendimento?',
      concluido:      'Concluir atendimento?',
      cancelado:      'Cancelar agendamento?',
    };

    Alert.alert('Confirmar', labels[newStatus], [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: newStatus === 'cancelado' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            await updateAppointmentStatus(appointmentId, newStatus);
            Alert.alert('Sucesso', 'Status atualizado!');
            // ✅ atualiza fila + stats após mudança de status
            await Promise.all([refreshQueue(), loadExtras()]);
          } catch (error: any) {
            Alert.alert('Erro', error.message);
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Sair da área administrativa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  // ── render helpers ─────────────────────────────────────────────────────────

  const renderStatCard = (
    icon: keyof typeof MaterialIcons.glyphMap,
    value: number,
    label: string,
    color: string
  ) => (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <MaterialIcons name={icon} size={28} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderAppointmentCard = (
    appointment: Appointment,
    showActions = true
  ) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.apptCardTop}>
        <View style={[styles.queueBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.queueBadgeText}>
            #{appointment.queue_position || '—'}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: getStatusColor(appointment.status) + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(appointment.status) }]} />
          <Text style={[styles.statusPillText, { color: getStatusColor(appointment.status) }]}>
            {getStatusLabel(appointment.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.apptUserName}>{appointment.user_name}</Text>
      <Text style={styles.apptService}>{appointment.service_name}</Text>

      {appointment.professional_name ? (
        <View style={styles.apptProfRow}>
          <MaterialIcons name="person-pin" size={13} color={theme.textSecondary} />
          <Text style={styles.apptMetaText}>{appointment.professional_name}</Text>
        </View>
      ) : null}

      <View style={styles.apptMeta}>
        <MaterialIcons name="calendar-today" size={13} color={theme.textSecondary} />
        <Text style={styles.apptMetaText}>{formatDate(appointment.scheduled_date)}</Text>
        <MaterialIcons name="access-time" size={13} color={theme.textSecondary} style={{ marginLeft: 10 }} />
        <Text style={styles.apptMetaText}>{formatTime(appointment.scheduled_time)}</Text>
      </View>

      {appointment.description ? (
        <Text style={styles.apptDescription}>{appointment.description}</Text>
      ) : null}

      {showActions && (
        <View style={styles.apptActions}>
          {appointment.status === 'agendado' && (
            <TouchableOpacity
              style={[styles.apptActionBtn, { backgroundColor: theme.yellow + '20', borderColor: theme.yellow }]}
              onPress={() => handleUpdateStatus(appointment.id, 'em_atendimento')}
            >
              <MaterialIcons name="play-arrow" size={16} color={theme.yellow} />
              <Text style={[styles.apptActionBtnText, { color: theme.yellow }]}>Iniciar</Text>
            </TouchableOpacity>
          )}
          {appointment.status === 'em_atendimento' && (
            <TouchableOpacity
              style={[styles.apptActionBtn, { backgroundColor: theme.green + '20', borderColor: theme.green }]}
              onPress={() => handleUpdateStatus(appointment.id, 'concluido')}
            >
              <MaterialIcons name="check" size={16} color={theme.green} />
              <Text style={[styles.apptActionBtnText, { color: theme.green }]}>Concluir</Text>
            </TouchableOpacity>
          )}
          {(appointment.status === 'agendado' || appointment.status === 'em_atendimento') && (
            <TouchableOpacity
              style={[styles.apptActionBtn, { backgroundColor: theme.red + '20', borderColor: theme.red }]}
              onPress={() => handleUpdateStatus(appointment.id, 'cancelado')}
            >
              <MaterialIcons name="close" size={16} color={theme.red} />
              <Text style={[styles.apptActionBtnText, { color: theme.red }]}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.blue} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.adminBadge}>
                <MaterialIcons name="admin-panel-settings" size={12} color="#fff" />
                <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                <MaterialIcons
                  name={isDark ? 'light-mode' : 'dark-mode'}
                  size={20}
                  color={theme.blue}
                />
              </TouchableOpacity>
              <View style={styles.avatarCircle}>
                <MaterialIcons name="admin-panel-settings" size={32} color={theme.blue} />
              </View>
            </View>
          </View>

          <View style={styles.headerStatusBar}>
            <View style={styles.headerStatusItem}>
              <View style={[styles.dot, { backgroundColor: theme.green }]} />
              <Text style={styles.headerStatusText}>Sistema Online</Text>
            </View>
            <View style={styles.headerStatusItem}>
              <MaterialIcons name="medical-services" size={14} color={theme.blue} />
              <Text style={styles.headerStatusText}>
                {onDutyProfessionals.length} profissional{onDutyProfessionals.length !== 1 ? 'is' : ''} de plantão
              </Text>
            </View>
          </View>
        </View>

        {/* ── Profissionais de Plantão ── */}
        {onDutyProfessionals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plantão Hoje</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {onDutyProfessionals.map((p) => (
                <View key={p.id} style={styles.professionalChip}>
                  <View style={styles.professionalChipDot} />
                  <View>
                    <Text style={styles.professionalChipName}>{p.name}</Text>
                    <Text style={styles.professionalChipSpec}>{p.specialty}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Estatísticas de Hoje ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoje</Text>
          <View style={styles.statsRow}>
            {renderStatCard('today',              appointmentStats.hoje,           'Agendamentos',   theme.blue)}
            {renderStatCard('play-circle-filled', appointmentStats.em_atendimento, 'Em Atendimento', theme.yellow)}
            {renderStatCard('check-circle',       appointmentStats.concluidos,     'Concluídos',     theme.green)}
          </View>
        </View>

        {/* ── Menu de Gestão ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestão</Text>
          <View style={styles.menuGrid}>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => setShowAppointmentsModal(true)}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: theme.green + '15' }]}>
                <MaterialIcons name="event-note" size={26} color={theme.green} />
              </View>
              <Text style={styles.menuCardTitle}>Agendamentos</Text>
              <Text style={styles.menuCardSub}>{activeAppointments.length} ativos hoje</Text>
              <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={handleShowHistory}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: theme.purple + '15' }]}>
                <MaterialIcons name="history" size={26} color={theme.purple} />
              </View>
              <Text style={styles.menuCardTitle}>Histórico</Text>
              <Text style={styles.menuCardSub}>Concluídos e cancelados</Text>
              <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('AdminServices')}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: theme.teal + '15' }]}>
                <MaterialIcons name="medical-services" size={26} color={theme.teal} />
              </View>
              <Text style={styles.menuCardTitle}>Serviços</Text>
              <Text style={styles.menuCardSub}>Gerenciar serviços</Text>
              <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => navigation.navigate('AdminProfessionals')}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: theme.blue + '15' }]}>
                <MaterialIcons name="groups" size={26} color={theme.blue} />
              </View>
              <Text style={styles.menuCardTitle}>Profissionais</Text>
              <Text style={styles.menuCardSub}>Equipe e plantão</Text>
              <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
            </TouchableOpacity>

          </View>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <MaterialIcons name="logout" size={20} color={theme.red} />
          <Text style={styles.logoutText}>Sair da Área Admin</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>SmartClínica v2.0.0</Text>
      </ScrollView>

      {/* ══════════════════════════════════════════
          MODAL — Agendamentos Ativos
      ══════════════════════════════════════════ */}
      <Modal
        visible={showAppointmentsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAppointmentsModal(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agendamentos Ativos</Text>
            <TouchableOpacity
              onPress={() => setShowAppointmentsModal(false)}
              style={styles.modalCloseBtn}
            >
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalSummaryBar}>
            <View style={styles.modalSummaryItem}>
              <Text style={[styles.modalSummaryValue, { color: theme.blue }]}>
                {appointmentStats.agendados}
              </Text>
              <Text style={styles.modalSummaryLabel}>Aguardando</Text>
            </View>
            <View style={styles.modalSummarySep} />
            <View style={styles.modalSummaryItem}>
              <Text style={[styles.modalSummaryValue, { color: theme.yellow }]}>
                {appointmentStats.em_atendimento}
              </Text>
              <Text style={styles.modalSummaryLabel}>Em Atend.</Text>
            </View>
            <View style={styles.modalSummarySep} />
            <View style={styles.modalSummaryItem}>
              <Text style={[styles.modalSummaryValue, { color: theme.green }]}>
                {activeAppointments.length}
              </Text>
              <Text style={styles.modalSummaryLabel}>Hoje</Text>
            </View>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {activeAppointments.length === 0 ? (
              <View style={styles.modalCentered}>
                <MaterialIcons name="event-busy" size={56} color={theme.border} />
                <Text style={styles.emptyText}>Nenhum agendamento ativo hoje</Text>
              </View>
            ) : (
              activeAppointments.map((a) => renderAppointmentCard(a, true))
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════
          MODAL — Histórico
      ══════════════════════════════════════════ */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Histórico</Text>
            <TouchableOpacity
              onPress={() => setShowHistoryModal(false)}
              style={styles.modalCloseBtn}
            >
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.modalCentered}>
              <ActivityIndicator size="large" color={theme.blue} />
            </View>
          ) : (
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {appointmentsHistory.length === 0 ? (
                <View style={styles.modalCentered}>
                  <MaterialIcons name="history" size={56} color={theme.border} />
                  <Text style={styles.emptyText}>Nenhum registro no histórico</Text>
                </View>
              ) : (
                appointmentsHistory.map((a) => renderAppointmentCard(a, false))
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
}