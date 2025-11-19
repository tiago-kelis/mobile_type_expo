import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routers/types';
import { styles } from './styles';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const route = useRoute<DashboardScreenRouteProp>();
  
  const { user } = route.params;

  // ✅ Verificação de segurança - redirecionar admin
  useEffect(() => {
    if (user.role === 'admin') {
      console.log('🔄 Admin redirecionado para AdminDashboard');
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminDashboard', params: { user } }],
      });
    }
  }, []);

  if (user.role === 'admin') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Redirecionando para área administrativa...</Text>
      </View>
    );
  }

  // 🏠 Navegar para Home
  function handleGoToHome() {
    navigation.navigate('Home', { user });
  }

  // 👤 Navegar para Perfil/User
  function handleGoToProfile() {
    navigation.navigate('User', { user });
  }

  // ✅ 📅 NOVA FUNÇÃO: Navegar para Agendamentos
  function handleGoToAppointments() {
    navigation.navigate('Appointments', { user });
  }

  // 🚪 Fazer Logout
  function handleLogout() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
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
  }

  // Formatar data
  function formatDate(dateString?: string): string {
    if (!dateString) return 'Hoje';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  }

  // Obter saudação baseada no horário
  function getGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header com informações do usuário */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userBadge}>
              <MaterialIcons name="person" size={14} color="#007bff" />
              <Text style={styles.userBadgeText}>USUÁRIO</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleGoToProfile}
          >
            <MaterialIcons name="account-circle" size={70} color="#007bff" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <MaterialIcons name="badge" size={16} color="#666" />
            <Text style={styles.infoText}>ID: #{user.id}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="calendar-today" size={16} color="#666" />
            <Text style={styles.infoText}>Membro desde {formatDate(user.created_at)}</Text>
          </View>
        </View>
      </View>      

      {/* ✅ MODIFICADO: Cards de Navegação Principal - Grid 2x2 com 3 cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Menu Principal</Text>
        
        <View style={styles.cardsGrid}>
          {/* Card Home - Posição 1 (linha 1, coluna 1) */}
          <TouchableOpacity 
            style={[styles.card, styles.cardHome]}
            onPress={handleGoToHome}
            activeOpacity={0.7}
          >
            <View>
              <View style={styles.cardIcon}>
                <MaterialIcons name="home" size={40} color="#00ffd0ff" />
              </View>
              <Text style={styles.cardTitle}>Home</Text>
              <Text style={styles.cardDescription}>
                Ver suas informações completas
              </Text>
            </View>
            <View style={styles.cardArrow}>
              <MaterialIcons name="arrow-forward" size={20} color="#00ffd0ff" />
            </View>
          </TouchableOpacity>

          {/* Card Perfil - Posição 2 (linha 1, coluna 2) */}
          <TouchableOpacity 
            style={[styles.card, styles.cardProfile]}
            onPress={handleGoToProfile}
            activeOpacity={0.7}
          >
            <View>
              <View style={styles.cardIcon}>
                <MaterialIcons name="person" size={40} color="#00ffd0ff" />
              </View>
              <Text style={styles.cardTitle}>Perfil</Text>
              <Text style={styles.cardDescription}>
                Editar dados cadastrais
              </Text>
            </View>
            <View style={styles.cardArrow}>
              <MaterialIcons name="arrow-forward" size={20} color="#00ffd0ff" />
            </View>
          </TouchableOpacity>

          {/* Card Agendamentos - Posição 3 (linha 2, coluna 1) */}
          <TouchableOpacity 
            style={[styles.card, styles.cardAppointments]}
            onPress={handleGoToAppointments}
            activeOpacity={0.7}
          >
            <View>
              <View style={styles.cardIcon}>
                <MaterialIcons name="event" size={40} color="#ff6b35" />
              </View>
              <Text style={styles.cardTitle}>Agendamentos</Text>
              <Text style={styles.cardDescription}>
                Marcar horários e ver fila
              </Text>
            </View>
            <View style={styles.cardArrow}>
              <MaterialIcons name="arrow-forward" size={20} color="#ff6b35" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ MODIFICADO: Ações Rápidas - Agendamentos adicionado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Ações Rápidas</Text>
        
        {/* ✅ NOVA AÇÃO: Agendamentos */}
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={handleGoToAppointments}
        >
          <MaterialIcons name="event" size={24} color="#ff6b35" />
          <Text style={styles.quickActionText}>Agendar Horário</Text>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={handleGoToProfile}
        >
          <MaterialIcons name="edit" size={24} color="#007bff" />
          <Text style={styles.quickActionText}>Editar Perfil</Text>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        >
          <MaterialIcons name="settings" size={24} color="#6c757d" />
          <Text style={styles.quickActionText}>Configurações</Text>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        >
          <MaterialIcons name="help-outline" size={24} color="#ffc107" />
          <Text style={styles.quickActionText}>Ajuda</Text>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Estatísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="access-time" size={32} color="#28a745" />
            <Text style={styles.statValue}>Online</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="verified-user" size={32} color="#007bff" />
            <Text style={styles.statValue}>Ativo</Text>
            <Text style={styles.statLabel}>Conta</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="security" size={32} color="#ffc107" />
            <Text style={styles.statValue}>Alta</Text>
            <Text style={styles.statLabel}>Segurança</Text>
          </View>
        </View>
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <MaterialIcons name="exit-to-app" size={24} color="#dc3545" />
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>

      {/* Rodapé */}
      <View style={styles.footer}>       
        <Text style={styles.footerVersion}>
          Versão 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}