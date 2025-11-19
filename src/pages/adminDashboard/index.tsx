import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList, UserData } from '../../routers/types'; // ✅ Importar UserData
import { styles } from './styles';
import { 
  getAllUsers, 
  getUserCountByRole, 
  promoteToAdmin, 
  demoteFromAdmin,
  deleteUser 
} from '../../database/services/userServices';
import { Appointment, getActiveAppointments, getAppointmentStats, SERVICE_TYPES, updateAppointmentStatus } from '../../database/services/servicesAppointments';

type AdminDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
type AdminDashboardScreenRouteProp = RouteProp<RootStackParamList, 'AdminDashboard'>;

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
}

export default function AdminDashboard() {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  const route = useRoute<AdminDashboardScreenRouteProp>();
  
  const { user } = route.params;
  
  // ✅ Estados com tipagem correta
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0
  });
  const [showUsersModal, setShowUsersModal] = useState<boolean>(false);
  const [users, setUsers] = useState<UserData[]>([]); // ✅ Tipagem correta
  const [loading, setLoading] = useState<boolean>(false);


  // ✅ NOVOS ESTADOS para agendamentos
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    agendados: 0,
    em_atendimento: 0,
    concluidos: 0,
    hoje: 0
  });
  const [activeAppointments, setActiveAppointments] = useState<Appointment[]>([]);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState<boolean>(false);

  // Carregar estatísticas (modificado)
  const loadStats = async (): Promise<void> => {
    try {
      // Carregar usuários
      const allUsers = getAllUsers();
      const roleCount = getUserCountByRole();
      
      setUserStats({
        totalUsers: allUsers.length,
        activeUsers: roleCount.users + roleCount.admins,
        newUsersToday: getTodayRegistrations(allUsers)
      });

      // ✅ NOVO: Carregar estatísticas de agendamentos
      const stats = getAppointmentStats();
      setAppointmentStats(stats);

      // ✅ NOVO: Carregar agendamentos ativos
      const active = getActiveAppointments();
      setActiveAppointments(active);

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // ✅ NOVA FUNÇÃO: Mostrar relatório de agendamentos
  const handleShowAppointmentsReport = () => {
    setShowAppointmentsModal(true);
  };

  // ✅ NOVA FUNÇÃO: Atualizar status do agendamento
  const handleUpdateStatus = (appointmentId: number, newStatus: 'agendado' | 'em_atendimento' | 'concluido') => {
    Alert.alert(
      'Atualizar Status',
      `Confirmar alteração de status?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            const success = updateAppointmentStatus(appointmentId, newStatus);
            if (success) {
              Alert.alert('Sucesso', 'Status atualizado!');
              loadStats(); // Recarregar dados
            } else {
              Alert.alert('Erro', 'Falha ao atualizar status');
            }
          }
        }
      ]
    );
  };


  

  // Contar registros de hoje
  const getTodayRegistrations = (users: UserData[]): number => {
    const today = new Date().toISOString().split('T')[0];
    return users.filter(user => 
      user.created_at && user.created_at.startsWith(today)
    ).length;
  };

  // Atualizar dados
  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  // Carregar usuários para modal
  const loadUsers = (): void => {
    try {
      setLoading(true);
      const allUsers = getAllUsers();
      setUsers(allUsers); // ✅ Agora funciona com tipagem correta
      setShowUsersModal(true);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Promover usuário
  const handlePromoteUser = (userId: number, userName: string): void => {
    Alert.alert(
      'Promover Usuário',
      `Deseja promover ${userName} a administrador?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Promover',
          style: 'default',
          onPress: () => {
            const success = promoteToAdmin(userId);
            if (success) {
              Alert.alert('Sucesso', 'Usuário promovido a administrador');
              loadUsers();
              loadStats();
            } else {
              Alert.alert('Erro', 'Falha ao promover usuário');
            }
          }
        }
      ]
    );
  };

  // Rebaixar admin
  const handleDemoteUser = (userId: number, userName: string): void => {
    Alert.alert(
      'Rebaixar Administrador',
      `Deseja remover privilégios de administrador de ${userName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rebaixar',
          style: 'destructive',
          onPress: () => {
            const success = demoteFromAdmin(userId);
            if (success) {
              Alert.alert('Sucesso', 'Privilégios removidos');
              loadUsers();
              loadStats();
            } else {
              Alert.alert('Erro', 'Falha ao rebaixar usuário');
            }
          }
        }
      ]
    );
  };

  // Deletar usuário
  const handleDeleteUser = (userId: number, userName: string): void => {
    Alert.alert(
      'Deletar Usuário',
      `Tem certeza que deseja deletar ${userName}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            const success = deleteUser(userId);
            if (success) {
              Alert.alert('Sucesso', 'Usuário deletado');
              loadUsers();
              loadStats();
            } else {
              Alert.alert('Erro', 'Falha ao deletar usuário');
            }
          }
        }
      ]
    );
  };

  // Logout
  const handleLogout = (): void => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da área administrativa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  // Obter saudação
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Carregar dados ao montar componente
  useEffect(() => {
    loadStats();
  }, []);


  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return '#007bff';
      case 'em_atendimento': return '#ffc107';
      case 'concluido': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_atendimento': return 'Em Atendimento';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  return (
    <>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Admin */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingText}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.adminBadge}>
                <MaterialIcons name="admin-panel-settings" size={16} color="#fff" />
                <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.avatarContainer}>
              <MaterialIcons name="admin-panel-settings" size={70} color="#dc3545" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <MaterialIcons name="security" size={16} color="#dc3545" />
              <Text style={styles.infoText}>Acesso Total</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="verified" size={16} color="#28a745" />
              <Text style={styles.infoText}>Sistema Online</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas em Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estatísticas do Sistema</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardBlue]}>
              <MaterialIcons name="people" size={32} color="#007bff" />
              <Text style={styles.statValue}>{userStats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Usuários</Text>
            </View>

            <View style={[styles.statCard, styles.statCardGreen]}>
              <MaterialIcons name="trending-up" size={32} color="#28a745" />
              <Text style={styles.statValue}>{userStats.activeUsers}</Text>
              <Text style={styles.statLabel}>Usuários Ativos</Text>
            </View>

            <View style={[styles.statCard, styles.statCardOrange]}>
              <MaterialIcons name="person-add" size={32} color="#ffc107" />
              <Text style={styles.statValue}>{userStats.newUsersToday}</Text>
              <Text style={styles.statLabel}>Novos Hoje</Text>
            </View>
          </View>
        </View>

        {/* Menu de Gestão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Gestão de Usuários</Text>
          
          <View style={styles.cardsGrid}>
            <TouchableOpacity 
              style={[styles.card, styles.cardUsers]}
              onPress={loadUsers}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <MaterialIcons name="people" size={40} color="#007bff" />
              </View>
              <Text style={styles.cardTitle}>Usuários</Text>
              <Text style={styles.cardDescription}>Gerenciar usuários do sistema</Text>
              <View style={styles.cardArrow}>
                <MaterialIcons name="arrow-forward" size={20} color="#007bff" />
              </View>
            </TouchableOpacity>

             {/* ✅ MODIFICADO: Card de Relatórios agora mostra agendamentos */}
            <TouchableOpacity 
              style={[styles.card, styles.cardReports]}
              onPress={handleShowAppointmentsReport}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <MaterialIcons name="ad-units" size={40} color="#28a745" />
              </View>
              <Text style={styles.cardTitle}>Agendamentos</Text>
              <Text style={styles.cardDescription}>
                {activeAppointments.length} ativos
              </Text>
              <View style={styles.cardArrow}>
                <MaterialIcons name="arrow-forward" size={20} color="#28a745" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsGrid}>
            <TouchableOpacity 
              style={[styles.card, styles.cardSettings]}
              onPress={() => Alert.alert('Em breve', 'Configurações do sistema')}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <MaterialIcons name="settings" size={40} color="#ffc107" />
              </View>
              <Text style={styles.cardTitle}>Sistema</Text>
              <Text style={styles.cardDescription}>Configurações gerais</Text>
              <View style={styles.cardArrow}>
                <MaterialIcons name="arrow-forward" size={20} color="#ffc107" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardSecurity]}
              onPress={() => Alert.alert('Em breve', 'Logs de segurança')}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <MaterialIcons name="security" size={40} color="#dc3545" />
              </View>
              <Text style={styles.cardTitle}>Segurança</Text>
              <Text style={styles.cardDescription}>Logs e auditoria</Text>
              <View style={styles.cardArrow}>
                <MaterialIcons name="arrow-forward" size={20} color="#dc3545" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Ações Administrativas</Text>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('User')}
          >
            <MaterialIcons name="person-add" size={24} color="#007bff" />
            <Text style={styles.quickActionText}>Adicionar Usuário</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Em breve', 'Backup automático configurado')}
          >
            <MaterialIcons name="backup" size={24} color="#28a745" />
            <Text style={styles.quickActionText}>Backup Sistema</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Em breve', 'Logs do sistema')}
          >
            <MaterialIcons name="description" size={24} color="#ffc107" />
            <Text style={styles.quickActionText}>Ver Logs</Text>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialIcons name="exit-to-app" size={24} color="#dc3545" />
          <Text style={styles.logoutButtonText}>Sair da Área Admin</Text>
        </TouchableOpacity>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>Painel Admin v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal de Usuários */}
      <Modal
        visible={showUsersModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gerenciar Usuários</Text>
            <TouchableOpacity 
              onPress={() => setShowUsersModal(false)}
              style={styles.modalCloseButton}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text>Carregando usuários...</Text>
            </View>
          ) : (
            <ScrollView style={styles.modalContent}>
              {users.map((userData: UserData) => ( // ✅ Tipagem explícita
                <View key={userData.id} style={styles.userItem}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <MaterialIcons 
                        name={userData.role === 'admin' ? 'admin-panel-settings' : 'person'} 
                        size={40} 
                        color={userData.role === 'admin' ? '#dc3545' : '#007bff'} 
                      />
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userNameModal}>{userData.name}</Text>
                      <Text style={styles.userEmailModal}>{userData.email}</Text>
                      <View style={styles.userBadge}>
                        <Text style={[
                          styles.userBadgeText,
                          { color: userData.role === 'admin' ? '#dc3545' : '#007bff' }
                        ]}>
                          {userData.role === 'admin' ? 'ADMIN' : 'USUÁRIO'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.userActions}>
                    {userData.role === 'user' ? (
                      <TouchableOpacity 
                        style={styles.promoteButton}
                        onPress={() => handlePromoteUser(userData.id, userData.name)}
                      >
                        <MaterialIcons name="arrow-upward" size={20} color="#28a745" />
                      </TouchableOpacity>
                    ) : userData.id !== user.id && ( // ✅ Não permitir rebaixar a si mesmo
                      <TouchableOpacity 
                        style={styles.demoteButton}
                        onPress={() => handleDemoteUser(userData.id, userData.name)}
                      >
                        <MaterialIcons name="arrow-downward" size={20} color="#ffc107" />
                      </TouchableOpacity>
                    )}

                    {userData.id !== user.id && ( // ✅ Não permitir deletar a si mesmo
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteUser(userData.id, userData.name)}
                      >
                        <MaterialIcons name="delete" size={20} color="#dc3545" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        
      </Modal>

      {/* ✅ NOVO: Modal de Relatório de Agendamentos */}
      <Modal
        visible={showAppointmentsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agendamentos Ativos</Text>
            <TouchableOpacity 
              onPress={() => setShowAppointmentsModal(false)}
              style={styles.modalCloseButton}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Resumo */}
          <View style={styles.appointmentSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{appointmentStats.agendados}</Text>
              <Text style={styles.summaryLabel}>Aguardando</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{appointmentStats.em_atendimento}</Text>
              <Text style={styles.summaryLabel}>Em Atendimento</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{appointmentStats.hoje}</Text>
              <Text style={styles.summaryLabel}>Hoje</Text>
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            {activeAppointments.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="ad-units" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Nenhum agendamento ativo</Text>
              </View>
            ) : (
              activeAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.appointmentItem}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentInfo}>
                      <Text style={styles.appointmentUser}>{appointment.user_name}</Text>
                      <Text style={styles.appointmentService}>
                        {SERVICE_TYPES.find(s => s.value === appointment.service_type)?.label}
                      </Text>
                      <Text style={styles.appointmentDateTime}>
                        {formatDate(appointment.scheduled_date)} às {formatTime(appointment.scheduled_time)}
                      </Text>
                    </View>
                    <View style={styles.appointmentQueue}>
                      <Text style={styles.queueNumber}>{appointment.queue_position}</Text>
                    </View>
                  </View>

                  <Text style={styles.appointmentDescription}>
                    {appointment.description}
                  </Text>

                  <View style={styles.appointmentActions}>
                    <View style={[
                      styles.emptyState,
                      { backgroundColor: getStatusColor(appointment.status) }
                    ]}>
                      <Text style={styles.emptyText}>
                        {getStatusLabel(appointment.status)}
                      </Text>
                    </View>

                    {/* Botões de ação */}
                    <View style={styles.actionButtons}>
                      {appointment.status === 'agendado' && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleUpdateStatus(appointment.id, 'em_atendimento')}
                        >
                          <MaterialIcons name="play-arrow" size={20} color="#ffc107" />
                        </TouchableOpacity>
                      )}
                      
                      {appointment.status === 'em_atendimento' && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleUpdateStatus(appointment.id, 'concluido')}
                        >
                          <MaterialIcons name="check" size={20} color="#28a745" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      
    </>
  );
}