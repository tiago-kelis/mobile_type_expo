import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList, UserData } from '../../routers/types';
import { styles } from './styles';
import {
  getAllUsers,
  getUserCountByRole,
  promoteToAdmin,
  demoteFromAdmin,
  deleteUser,
} from '../../database/services/userServices';
import {
  Appointment,
  getAppointmentsByDate,
  getAppointmentsHistory,
  getAppointmentStats,
  getDetailedStats,
  SERVICE_TYPES,
  updateAppointmentStatus,
} from '../../database/services/servicesAppointments';

type AdminDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
type AdminDashboardScreenRouteProp      = RouteProp<RootStackParamList, 'AdminDashboard'>;

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
}

export default function AdminDashboard() {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  const route      = useRoute<AdminDashboardScreenRouteProp>();
  const { user }   = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(false);

  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
  });

  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    agendados: 0,
    em_atendimento: 0,
    concluidos: 0,
    hoje: 0,
  });

  const [detailedStats, setDetailedStats] = useState({
    hoje:       { total: 0, agendados: 0, em_atendimento: 0, concluidos: 0 },
    esta_semana: { total: 0, concluidos: 0 },
    este_mes:   { total: 0, concluidos: 0 },
  });

  const [activeAppointments, setActiveAppointments]     = useState<Appointment[]>([]);
  const [appointmentsHistory, setAppointmentsHistory]   = useState<Appointment[]>([]);
  const [users, setUsers]                               = useState<UserData[]>([]);

  const [showUsersModal, setShowUsersModal]             = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal]         = useState(false);

  // ── helpers ────────────────────────────────────────────────────────────────

  
  const getLocalDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

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
      case 'agendado':        return '#3b82f6';
      case 'em_atendimento':  return '#f59e0b';
      case 'concluido':       return '#10b981';
      case 'cancelado':       return '#ef4444';
      default:                return '#6b7280';
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

  const getServiceLabel = (value: string) =>
    SERVICE_TYPES.find((s) => s.value === value)?.label ?? value;

  // ── data ───────────────────────────────────────────────────────────────────

  const loadStats = async () => {
    try {
      // ✅ Data local — evita bug de timezone
      const today = getLocalDateString(new Date());
      console.log('📅 Admin carregando fila para:', today);

      // Usuários
      const allUsers  = getAllUsers();
      const roleCount = getUserCountByRole();

      // ✅ CORRIGIDO: getTodayRegistrations usa data local
      const todayLocal = today;
      const newToday   = allUsers.filter(
        (u) => u.created_at?.startsWith(todayLocal)
      ).length;

      setUserStats({
        totalUsers:    allUsers.length,
        activeUsers:   roleCount.users + roleCount.admins,
        newUsersToday: newToday,
      });

      // Estatísticas gerais
      setAppointmentStats(getAppointmentStats());
      setDetailedStats(getDetailedStats());

      // ✅ CORRIGIDO: busca agendamentos passando a data local diretamente
      // em vez de depender de getTodayAppointments() que calcula a data internamente
      const todayAll = getAppointmentsByDate(today);

      const active = todayAll.filter(
        (a) => a.status === 'agendado' || a.status === 'em_atendimento'
      );

      console.log(`📋 Admin — fila hoje (${today}): ${active.length} ativos de ${todayAll.length} total`);
      setActiveAppointments(active);

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadUsers = () => {
    try {
      setLoading(true);
      setUsers(getAllUsers());
      setShowUsersModal(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleShowHistory = () => {
    try {
      setAppointmentsHistory(getAppointmentsHistory(100));
      setShowHistoryModal(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) loadStats();
    return () => { mounted = false; };
  }, []);

  // ── user actions ───────────────────────────────────────────────────────────

  const handlePromoteUser = (userId: number, userName: string) => {
    Alert.alert('Promover Usuário', `Promover ${userName} a administrador?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Promover',
        onPress: () => {
          if (promoteToAdmin(userId)) {
            Alert.alert('Sucesso', 'Usuário promovido a administrador');
            loadUsers(); loadStats();
          } else {
            Alert.alert('Erro', 'Falha ao promover usuário');
          }
        },
      },
    ]);
  };

  const handleDemoteUser = (userId: number, userName: string) => {
    Alert.alert('Rebaixar Admin', `Remover privilégios de ${userName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Rebaixar',
        style: 'destructive',
        onPress: () => {
          if (demoteFromAdmin(userId)) {
            Alert.alert('Sucesso', 'Privilégios removidos');
            loadUsers(); loadStats();
          } else {
            Alert.alert('Erro', 'Falha ao rebaixar usuário');
          }
        },
      },
    ]);
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    Alert.alert('Deletar Usuário', `Deletar ${userName}? Esta ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => {
          if (deleteUser(userId)) {
            Alert.alert('Sucesso', 'Usuário deletado');
            loadUsers(); loadStats();
          } else {
            Alert.alert('Erro', 'Falha ao deletar usuário');
          }
        },
      },
    ]);
  };

  // ── appointment actions ────────────────────────────────────────────────────

  const handleUpdateStatus = (
    appointmentId: number,
    newStatus: 'agendado' | 'em_atendimento' | 'concluido'
  ) => {
    Alert.alert('Atualizar Status', 'Confirmar alteração de status?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => {
          if (updateAppointmentStatus(appointmentId, newStatus)) {
            Alert.alert('Sucesso', 'Status atualizado!');
            loadStats();
          } else {
            Alert.alert('Erro', 'Falha ao atualizar status');
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
        onPress: () =>
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
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
      {/* topo */}
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

      {/* corpo */}
      <Text style={styles.apptUserName}>{appointment.user_name}</Text>
      <Text style={styles.apptService}>
        {getServiceLabel(appointment.service_type)}
      </Text>

      <View style={styles.apptMeta}>
        <MaterialIcons name="calendar-today" size={13} color="#94a3b8" />
        <Text style={styles.apptMetaText}>
          {formatDate(appointment.scheduled_date)}
        </Text>
        <MaterialIcons
          name="access-time"
          size={13}
          color="#94a3b8"
          style={{ marginLeft: 10 }}
        />
        <Text style={styles.apptMetaText}>
          {formatTime(appointment.scheduled_time)}
        </Text>
      </View>

      {appointment.description ? (
        <Text style={styles.apptDescription}>{appointment.description}</Text>
      ) : null}

      {/* ações */}
      {showActions && (
        <View style={styles.apptActions}>
          {appointment.status === 'agendado' && (
            <TouchableOpacity
              style={[styles.apptActionBtn, { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' }]}
              onPress={() => handleUpdateStatus(appointment.id, 'em_atendimento')}
            >
              <MaterialIcons name="play-arrow" size={16} color="#f59e0b" />
              <Text style={[styles.apptActionBtnText, { color: '#f59e0b' }]}>
                Iniciar
              </Text>
            </TouchableOpacity>
          )}
          {appointment.status === 'em_atendimento' && (
            <TouchableOpacity
              style={[styles.apptActionBtn, { backgroundColor: '#10b98120', borderColor: '#10b981' }]}
              onPress={() => handleUpdateStatus(appointment.id, 'concluido')}
            >
              <MaterialIcons name="check" size={16} color="#10b981" />
              <Text style={[styles.apptActionBtnText, { color: '#10b981' }]}>
                Concluir
              </Text>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
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
            <View style={styles.avatarCircle}>
              <MaterialIcons name="admin-panel-settings" size={36} color="#3b82f6" />
            </View>
          </View>

          <View style={styles.headerStatusBar}>
            <View style={styles.headerStatusItem}>
              <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.headerStatusText}>Sistema Online</Text>
            </View>
            <View style={styles.headerStatusItem}>
              <MaterialIcons name="security" size={14} color="#3b82f6" />
              <Text style={styles.headerStatusText}>Acesso Total</Text>
            </View>
          </View>
        </View>

        {/* ── Estatísticas de Hoje ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoje</Text>
          <View style={styles.statsRow}>
            {renderStatCard('today',              detailedStats.hoje.total,           'Agendamentos',  '#3b82f6')}
            {renderStatCard('play-circle-filled', detailedStats.hoje.em_atendimento,  'Em Atendimento','#f59e0b')}
            {renderStatCard('check-circle',       detailedStats.hoje.concluidos,      'Concluídos',    '#10b981')}
          </View>
        </View>

        {/* ── Período ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Período</Text>
          <View style={styles.periodRow}>
            <View style={styles.periodCard}>
              <Text style={styles.periodCardLabel}>Esta Semana</Text>
              <Text style={styles.periodCardTotal}>{detailedStats.esta_semana.total}</Text>
              <Text style={styles.periodCardSub}>{detailedStats.esta_semana.concluidos} concluídos</Text>
            </View>
            <View style={[styles.periodCard, { marginHorizontal: 12 }]}>
              <Text style={styles.periodCardLabel}>Este Mês</Text>
              <Text style={styles.periodCardTotal}>{detailedStats.este_mes.total}</Text>
              <Text style={styles.periodCardSub}>{detailedStats.este_mes.concluidos} concluídos</Text>
            </View>
            <View style={styles.periodCard}>
              <Text style={styles.periodCardLabel}>Usuários</Text>
              <Text style={styles.periodCardTotal}>{userStats.totalUsers}</Text>
              <Text style={styles.periodCardSub}>{userStats.newUsersToday} hoje</Text>
            </View>
          </View>
        </View>

        {/* ── Menu de Gestão ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestão</Text>
          <View style={styles.menuGrid}>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={loadUsers}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#3b82f615' }]}>
                <MaterialIcons name="people" size={26} color="#3b82f6" />
              </View>
              <Text style={styles.menuCardTitle}>Usuários</Text>
              <Text style={styles.menuCardSub}>{userStats.totalUsers} cadastrados</Text>
              <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => setShowAppointmentsModal(true)}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#10b98115' }]}>
                <MaterialIcons name="event-note" size={26} color="#10b981" />
              </View>
              <Text style={styles.menuCardTitle}>Agendamentos</Text>
              <Text style={styles.menuCardSub}>{activeAppointments.length} ativos hoje</Text>
              <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={handleShowHistory}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#8b5cf615' }]}>
                <MaterialIcons name="history" size={26} color="#8b5cf6" />
              </View>
              <Text style={styles.menuCardTitle}>Histórico</Text>
              <Text style={styles.menuCardSub}>Concluídos e cancelados</Text>
              <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCard}
              onPress={() => Alert.alert('Em breve', 'Configurações do sistema')}
              activeOpacity={0.75}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#f59e0b15' }]}>
                <MaterialIcons name="settings" size={26} color="#f59e0b" />
              </View>
              <Text style={styles.menuCardTitle}>Sistema</Text>
              <Text style={styles.menuCardSub}>Configurações gerais</Text>
              <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
            </TouchableOpacity>

          </View>
        </View>

        {/* ── Ações Rápidas ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('User')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#3b82f615' }]}>
              <MaterialIcons name="person-add" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.quickActionText}>Adicionar Usuário</Text>
            <MaterialIcons name="chevron-right" size={20} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Alert.alert('Em breve', 'Backup automático configurado')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#10b98115' }]}>
              <MaterialIcons name="backup" size={20} color="#10b981" />
            </View>
            <Text style={styles.quickActionText}>Backup do Sistema</Text>
            <MaterialIcons name="chevron-right" size={20} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Alert.alert('Em breve', 'Logs do sistema')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#f59e0b15' }]}>
              <MaterialIcons name="description" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.quickActionText}>Ver Logs</Text>
            <MaterialIcons name="chevron-right" size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sair da Área Admin</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Painel Admin v1.0.0</Text>
      </ScrollView>

      {/* ══════════════════════════════════════════
          MODAL — Usuários
      ══════════════════════════════════════════ */}
      <Modal
        visible={showUsersModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUsersModal(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gerenciar Usuários</Text>
            <TouchableOpacity
              onPress={() => setShowUsersModal(false)}
              style={styles.modalCloseBtn}
            >
              <MaterialIcons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.modalCentered}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.modalLoadingText}>Carregando usuários...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {users.length === 0 ? (
                <View style={styles.modalCentered}>
                  <MaterialIcons name="people-outline" size={56} color="#334155" />
                  <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
                </View>
              ) : (
                users.map((u: UserData) => (
                  <View key={u.id} style={styles.userCard}>
                    <View style={styles.userCardLeft}>
                      <View style={[
                        styles.userAvatar,
                        { backgroundColor: u.role === 'admin' ? '#ef444415' : '#3b82f615' },
                      ]}>
                        <MaterialIcons
                          name={u.role === 'admin' ? 'admin-panel-settings' : 'person'}
                          size={28}
                          color={u.role === 'admin' ? '#ef4444' : '#3b82f6'}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.userCardName}>{u.name}</Text>
                        <Text style={styles.userCardEmail}>{u.email}</Text>
                        <View style={[
                          styles.userRolePill,
                          { backgroundColor: u.role === 'admin' ? '#ef444420' : '#3b82f620' },
                        ]}>
                          <Text style={[
                            styles.userRoleText,
                            { color: u.role === 'admin' ? '#ef4444' : '#3b82f6' },
                          ]}>
                            {u.role === 'admin' ? 'ADMIN' : 'USUÁRIO'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.userCardActions}>
                      {u.role === 'user' ? (
                        <TouchableOpacity
                          style={[styles.iconBtn, { backgroundColor: '#10b98120' }]}
                          onPress={() => handlePromoteUser(u.id, u.name)}
                        >
                          <MaterialIcons name="arrow-upward" size={18} color="#10b981" />
                        </TouchableOpacity>
                      ) : u.id !== user.id ? (
                        <TouchableOpacity
                          style={[styles.iconBtn, { backgroundColor: '#f59e0b20' }]}
                          onPress={() => handleDemoteUser(u.id, u.name)}
                        >
                          <MaterialIcons name="arrow-downward" size={18} color="#f59e0b" />
                        </TouchableOpacity>
                      ) : null}

                      {u.id !== user.id && (
                        <TouchableOpacity
                          style={[styles.iconBtn, { backgroundColor: '#ef444420', marginLeft: 8 }]}
                          onPress={() => handleDeleteUser(u.id, u.name)}
                        >
                          <MaterialIcons name="delete-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </View>
      </Modal>

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
              <MaterialIcons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Resumo rápido */}
          <View style={styles.modalSummaryBar}>
            <View style={styles.modalSummaryItem}>
              <Text style={[styles.modalSummaryValue, { color: '#3b82f6' }]}>
                {appointmentStats.agendados}
              </Text>
              <Text style={styles.modalSummaryLabel}>Aguardando</Text>
            </View>
            <View style={styles.modalSummarySep} />
            <View style={styles.modalSummaryItem}>
              <Text style={[styles.modalSummaryValue, { color: '#f59e0b' }]}>
                {appointmentStats.em_atendimento}
              </Text>
              <Text style={styles.modalSummaryLabel}>Em Atend.</Text>
            </View>
            <View style={styles.modalSummarySep} />
            <View style={styles.modalSummaryItem}>
              <Text style={[styles.modalSummaryValue, { color: '#10b981' }]}>
                {activeAppointments.length}
              </Text>
              <Text style={styles.modalSummaryLabel}>Hoje</Text>
            </View>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {activeAppointments.length === 0 ? (
              <View style={styles.modalCentered}>
                <MaterialIcons name="event-busy" size={56} color="#334155" />
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
              <MaterialIcons name="close" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {appointmentsHistory.length === 0 ? (
              <View style={styles.modalCentered}>
                <MaterialIcons name="history" size={56} color="#334155" />
                <Text style={styles.emptyText}>Nenhum registro no histórico</Text>
              </View>
            ) : (
              appointmentsHistory.map((a) => renderAppointmentCard(a, false))
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}