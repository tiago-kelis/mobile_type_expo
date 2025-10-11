import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../routers/types';
import { styles } from './styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  
  // ✅ Receber dados do usuário logado
  const { user } = route.params;

  function handleLogout() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  // Formatar data
  function formatDate(dateString?: string): string {
    if (!dateString) return 'Não disponível';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header com Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="account-circle" size={100} color="#007bff" />
        </View>
        
        <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Card com Informações do Usuário */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>📋 Informações da Conta</Text>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={24} color="#007bff" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={24} color="#007bff" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <MaterialIcons name="badge" size={24} color="#007bff" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>ID do Usuário</Text>
            <Text style={styles.infoValue}>#{user.id}</Text>
          </View>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <MaterialIcons name="calendar-today" size={24} color="#007bff" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Membro desde</Text>
            <Text style={styles.infoValue}>{formatDate(user.created_at)}</Text>
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('User')}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.settingsButton]}
          onPress={() => {
            // Adicionar navegação para configurações depois
            console.log('Ir para configurações');
          }}
        >
          <MaterialIcons name="settings" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <MaterialIcons name="exit-to-app" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas (opcional) */}
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
      </View>
    </ScrollView>
  );
}