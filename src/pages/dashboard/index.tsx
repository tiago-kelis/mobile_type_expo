import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routers/types';
import { styles } from './styles';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardScreenRouteProp     = RouteProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const route      = useRoute<DashboardScreenRouteProp>();
  const { user }   = route.params;

  // ── redirecionar admin ─────────────────────────────────────────────────────
  useEffect(() => {
    if (user.role === 'admin') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminDashboard', params: { user } }],
      });
    }
  }, []);

  if (user.role === 'admin') {
    return (
      <View style={styles.redirectScreen}>
        <Text style={styles.redirectText}>Redirecionando...</Text>
      </View>
    );
  }

  // ── helpers ────────────────────────────────────────────────────────────────


  // src/pages/adminDashboard/index.tsx
// ── Adicionar helper no topo do componente ─────────────────────────────────

  const getLocalDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };


  // ── Helper local no topo do arquivo ───────────────────────────────────────
function getLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ── Substituir todas as ocorrências de: ───────────────────────────────────
// const today = new Date().toISOString().split('T')[0];
// por:
// const today = getLocalDate();


  const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // ✅ CORRIGIDO: trata string ISO com ou sem horário
  const formatMemberDate = (dateString?: string): string => {
    if (!dateString) return 'data desconhecida';
    try {
      const normalized = dateString.includes('T')
        ? dateString
        : dateString + 'T00:00:00';
      return new Date(normalized).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'data inválida';
    }
  };

  // ── navegação ──────────────────────────────────────────────────────────────

  const goTo = (screen: keyof RootStackParamList) =>
    navigation.navigate(screen as any, { user });

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () =>
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
      },
    ]);
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userBadge}>
              <MaterialIcons name="person" size={12} color="#3b82f6" />
              <Text style={styles.userBadgeText}>USUÁRIO</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => goTo('User')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="account-circle" size={52} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerInfoBar}>
          <View style={styles.headerInfoItem}>
            <MaterialIcons name="badge" size={14} color="#64748b" />
            <Text style={styles.headerInfoText}>ID #{user.id}</Text>
          </View>
          <View style={styles.headerInfoItem}>
            <MaterialIcons name="calendar-today" size={14} color="#64748b" />
            <Text style={styles.headerInfoText}>
              Membro desde {formatMemberDate(user.created_at)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Menu Principal ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Principal</Text>

        <View style={styles.menuGrid}>
          {/* Home */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => goTo('Home')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#10b98115' }]}>
              <MaterialIcons name="home" size={26} color="#10b981" />
            </View>
            <Text style={styles.menuCardTitle}>Home</Text>
            <Text style={styles.menuCardSub}>Ver informações completas</Text>
            <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
          </TouchableOpacity>

          {/* Perfil */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => goTo('User')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#3b82f615' }]}>
              <MaterialIcons name="person" size={26} color="#3b82f6" />
            </View>
            <Text style={styles.menuCardTitle}>Perfil</Text>
            <Text style={styles.menuCardSub}>Editar dados cadastrais</Text>
            <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
          </TouchableOpacity>

          {/* Agendamentos */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => goTo('Appointments')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#f59e0b15' }]}>
              <MaterialIcons name="event" size={26} color="#f59e0b" />
            </View>
            <Text style={styles.menuCardTitle}>Agendamentos</Text>
            <Text style={styles.menuCardSub}>Marcar horários e fila</Text>
            <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
          </TouchableOpacity>

          {/* Em breve */}
          <TouchableOpacity
            style={[styles.menuCard, styles.menuCardDisabled]}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#8b5cf615' }]}>
              <MaterialIcons name="star-outline" size={26} color="#8b5cf6" />
            </View>
            <Text style={styles.menuCardTitle}>Novidades</Text>
            <Text style={styles.menuCardSub}>Em breve</Text>
            <MaterialIcons name="chevron-right" size={18} color="#475569" style={styles.menuArrow} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Ações Rápidas ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => goTo('Appointments')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#f59e0b15' }]}>
            <MaterialIcons name="event-note" size={20} color="#f59e0b" />
          </View>
          <Text style={styles.quickActionText}>Agendar Horário</Text>
          <MaterialIcons name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => goTo('User')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#3b82f615' }]}>
            <MaterialIcons name="edit" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.quickActionText}>Editar Perfil</Text>
          <MaterialIcons name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#64748b15' }]}>
            <MaterialIcons name="settings" size={20} color="#64748b" />
          </View>
          <Text style={styles.quickActionText}>Configurações</Text>
          <MaterialIcons name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#f59e0b15' }]}>
            <MaterialIcons name="help-outline" size={20} color="#f59e0b" />
          </View>
          <Text style={styles.quickActionText}>Ajuda</Text>
          <MaterialIcons name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* ── Status da Conta ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status da Conta</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#10b98115' }]}>
              <MaterialIcons name="wifi" size={22} color="#10b981" />
            </View>
            <Text style={styles.statValue}>Online</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#3b82f615' }]}>
              <MaterialIcons name="verified-user" size={22} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>Ativo</Text>
            <Text style={styles.statLabel}>Conta</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#f59e0b15' }]}>
              <MaterialIcons name="security" size={22} color="#f59e0b" />
            </View>
            <Text style={styles.statValue}>Alta</Text>
            <Text style={styles.statLabel}>Segurança</Text>
          </View>
        </View>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <MaterialIcons name="logout" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Versão 1.0.0</Text>
    </ScrollView>
  );
}