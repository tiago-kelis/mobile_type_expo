import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routers/types';
import { makeStyles } from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const navigation          = useNavigation<DashboardScreenNavigationProp>();
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut }   = useAuth();
  const styles              = makeStyles(theme);

  // ── redirecionar admin ─────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (user?.role === 'admin') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminDashboard', params: { user } }],
        });
      }
    }, [user])
  );

  if (!user || user.role === 'admin') {
    return (
      <View style={styles.redirectScreen}>
        <Text style={styles.redirectText}>Redirecionando...</Text>
      </View>
    );
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  const getGreeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatMemberDate = (dateString?: string): string => {
    if (!dateString) return 'data desconhecida';
    try {
      const normalized = dateString.includes('T')
        ? dateString
        : dateString + 'T00:00:00';
      return new Date(normalized).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
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
        onPress: async () => {
          await signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
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
              <MaterialIcons name="local-hospital" size={12} color={theme.teal} />
              <Text style={styles.userBadgeText}>PACIENTE</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* ✅ Toggle de tema */}
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              <MaterialIcons
                name={isDark ? 'light-mode' : 'dark-mode'}
                size={20}
                color={theme.blue}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarCircle}
              onPress={() => goTo('User')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="account-circle" size={42} color={theme.blue} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerInfoBar}>
          <View style={styles.headerInfoItem}>
            <MaterialIcons name="badge" size={14} color={theme.textMuted} />
            <Text style={styles.headerInfoText}>ID #{user.id}</Text>
          </View>
          <View style={styles.headerInfoItem}>
            <MaterialIcons name="calendar-today" size={14} color={theme.textMuted} />
            <Text style={styles.headerInfoText}>
              Desde {formatMemberDate(user.created_at)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Menu Principal ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Principal</Text>

        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => goTo('Home')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: theme.green + '15' }]}>
              <MaterialIcons name="home" size={26} color={theme.green} />
            </View>
            <Text style={styles.menuCardTitle}>Perfil</Text>
            <Text style={styles.menuCardSub}>Minhas informações</Text>
            <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.menuCard}
            onPress={() => goTo('User')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: theme.blue + '15' }]}>
              <MaterialIcons name="person" size={26} color={theme.blue} />
            </View>
            <Text style={styles.menuCardTitle}>Perfil</Text>
            <Text style={styles.menuCardSub}>Editar dados cadastrais</Text>
            <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => goTo('Appointments')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: theme.yellow + '15' }]}>
              <MaterialIcons name="event" size={26} color={theme.yellow} />
            </View>
            <Text style={styles.menuCardTitle}>Agendamentos</Text>
            <Text style={styles.menuCardSub}>Marcar consultas e fila</Text>
            <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.menuCard, styles.menuCardDisabled]}
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIconBox, { backgroundColor: theme.teal + '15' }]}>
              <MaterialIcons name="medical-services" size={26} color={theme.teal} />
            </View>
            <Text style={styles.menuCardTitle}>Serviços</Text>
            <Text style={styles.menuCardSub}>Em breve</Text>
            <MaterialIcons name="chevron-right" size={18} color={theme.textMuted} style={styles.menuArrow} />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* ── Ações Rápidas ── */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text> */}

        {/* <TouchableOpacity style={styles.quickAction} onPress={() => goTo('Appointments')} activeOpacity={0.8}>
          <View style={[styles.quickActionIcon, { backgroundColor: theme.yellow + '15' }]}>
            <MaterialIcons name="event-note" size={20} color={theme.yellow} />
          </View>
          <Text style={styles.quickActionText}>Agendar Consulta</Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.quickAction} onPress={() => goTo('User')} activeOpacity={0.8}>
          <View style={[styles.quickActionIcon, { backgroundColor: theme.blue + '15' }]}>
            <MaterialIcons name="edit" size={20} color={theme.blue} />
          </View>
          <Text style={styles.quickActionText}>Editar Perfil</Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.textMuted + '15' }]}>
            <MaterialIcons name="settings" size={20} color={theme.textMuted} />
          </View>
          <Text style={styles.quickActionText}>Configurações</Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.yellow + '15' }]}>
            <MaterialIcons name="help-outline" size={20} color={theme.yellow} />
          </View>
          <Text style={styles.quickActionText}>Ajuda</Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View> */}

      {/* ── Status da Conta ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status da Conta</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.green + '15' }]}>
              <MaterialIcons name="wifi" size={22} color={theme.green} />
            </View>
            <Text style={styles.statValue}>Online</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.blue + '15' }]}>
              <MaterialIcons name="verified-user" size={22} color={theme.blue} />
            </View>
            <Text style={styles.statValue}>Ativo</Text>
            <Text style={styles.statLabel}>Conta</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: theme.teal + '15' }]}>
              <MaterialIcons name="local-hospital" size={22} color={theme.teal} />
            </View>
            <Text style={styles.statValue}>Saúde</Text>
            <Text style={styles.statLabel}>Clínica</Text>
          </View>
        </View>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <MaterialIcons name="logout" size={20} color={theme.red} />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>SmartClínica v2.0.0</Text>
    </ScrollView>
  );
}