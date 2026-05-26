import React from 'react';
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

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp      = RouteProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route      = useRoute<HomeScreenRouteProp>();
  const { user }   = route.params;

  // ── helpers ────────────────────────────────────────────────────────────────

  // ✅ CORRIGIDO: normaliza string ISO com ou sem horário
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
      {/* ── Botão Voltar ── */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard', { user })}
        activeOpacity={0.8}
      >
        <MaterialIcons name="arrow-back" size={20} color="#3b82f6" />
        <Text style={styles.backButtonText}>Voltar ao Dashboard</Text>
      </TouchableOpacity>

      {/* ── Header / Avatar ── */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="account-circle" size={72} color="#3b82f6" />
        </View>
        <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.userBadge}>
          <MaterialIcons name="person" size={12} color="#3b82f6" />
          <Text style={styles.userBadgeText}>USUÁRIO</Text>
        </View>
      </View>

      {/* ── Card de Informações ── */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Informações da Conta</Text>

        {[
          { icon: 'person',        label: 'Nome',          value: user.name },
          { icon: 'email',         label: 'E-mail',        value: user.email },
          { icon: 'badge',         label: 'ID do Usuário', value: `#${user.id}` },
          { icon: 'calendar-today',label: 'Membro desde',  value: formatDate(user.created_at) },
        ].map((item, index, arr) => (
          <React.Fragment key={item.label}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <MaterialIcons
                  name={item.icon as any}
                  size={20}
                  color="#3b82f6"
                />
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
          <View style={[styles.actionIconBox, { backgroundColor: '#3b82f620' }]}>
            <MaterialIcons name="edit" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.actionBtnText}>Editar Perfil</Text>
          <MaterialIcons name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Appointments', { user })}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#f59e0b20' }]}>
            <MaterialIcons name="event-note" size={20} color="#f59e0b" />
          </View>
          <Text style={styles.actionBtnText}>Meus Agendamentos</Text>
          <MaterialIcons name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#64748b20' }]}>
            <MaterialIcons name="settings" size={20} color="#64748b" />
          </View>
          <Text style={styles.actionBtnText}>Configurações</Text>
          <MaterialIcons name="chevron-right" size={20} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* ── Status ── */}
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