import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routers/types';
import { makeStyles } from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation            = useNavigation<HomeScreenNavigationProp>();
  const { theme }             = useTheme();
  const { user, signOut }     = useAuth();
  const styles                = makeStyles(theme);

  if (!user) return null;

  // ── helpers ────────────────────────────────────────────────────────────────

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Não disponível';
    try {
      const normalized = dateString.includes('T')
        ? dateString
        : dateString + 'T00:00:00';
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  };

  // ── ações ──────────────────────────────────────────────────────────────────

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
      {/* ── Botão Voltar ── */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard', { user })}
        activeOpacity={0.8}
      >
        <MaterialIcons name="arrow-back" size={20} color={theme.blue} />
        <Text style={styles.backButtonText}>Voltar ao Dashboard</Text>
      </TouchableOpacity>

      {/* ── Header / Avatar ── */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="account-circle" size={72} color={theme.blue} />
        </View>
        <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.userBadge}>
          <MaterialIcons name="local-hospital" size={12} color={theme.teal} />
          <Text style={styles.userBadgeText}>PACIENTE</Text>
        </View>
      </View>

      {/* ── Card de Informações ── */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Informações da Conta</Text>

        {[
          { icon: 'person',         label: 'Nome',          value: user.name },
          { icon: 'email',          label: 'E-mail',        value: user.email },
          { icon: 'badge',          label: 'ID do Paciente',value: `#${user.id}` },
          { icon: 'calendar-today', label: 'Cadastrado em', value: formatDate(user.created_at) },
        ].map((item, index, arr) => (
          <React.Fragment key={item.label}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <MaterialIcons name={item.icon as any} size={20} color={theme.teal} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
            {index < arr.length - 1 && <View style={styles.infoDivider} />}
          </React.Fragment>
        ))}
      </View>

      {/* ── Ações ── */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('User', { user })}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: theme.blue + '20' }]}>
            <MaterialIcons name="edit" size={20} color={theme.blue} />
          </View>
          <Text style={styles.actionBtnText}>Editar Perfil</Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Appointments', { user })}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: theme.yellow + '20' }]}>
            <MaterialIcons name="event-note" size={20} color={theme.yellow} />
          </View>
          <Text style={styles.actionBtnText}>Minhas Consultas</Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: theme.textMuted + '20' }]}>
            <MaterialIcons name="settings" size={20} color={theme.textMuted} />
          </View>
          <Text style={styles.actionBtnText}>Configurações</Text>
          <MaterialIcons name="chevron-right" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* ── Status ── */}
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

      {/* ── Logout ── */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <MaterialIcons name="logout" size={20} color={theme.red} />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>SmartClínica v2.0.0</Text>
    </ScrollView>
  );
}