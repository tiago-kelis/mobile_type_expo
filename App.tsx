import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Routes from './src/routers';
import { initDatabase } from './src/database/initDB';
import { dbUtils } from './src/database/utils';
import {
  debugAllUsers,
  makeUserAdmin,
} from './src/database/services/userServices';
import { seedAdmin } from './src/database/seedAdmin';

// ── Tokens (mesmo sistema de todo o app) ─────────────────────────────────────
const C = {
  bg:      '#0f172a',
  surface: '#1e293b',
  border:  '#334155',

  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted:     '#64748b',

  blue:   '#3b82f6',
  green:  '#10b981',
  yellow: '#f59e0b',
  red:    '#ef4444',
};

export default function App() {
  const [isLoading, setIsLoading]   = useState(true);
  const [dbError, setDbError]       = useState<string | null>(null);
  const [showDevMenu, setShowDevMenu] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  // ── inicialização ────────────────────────────────────────────────────────

  async function initializeApp() {
    try {
      console.log('🚀 Iniciando aplicação...');

      const success = initDatabase();

     // dentro de initializeApp(), após initDatabase():
      if (success) {
        console.log('✅ Banco de dados pronto!');

        const result = seedAdmin();
        console.log(`🌱 Seed admin: [${result.status}] ${result.message}`);

        debugAllUsers();
        dbUtils.stats();
      }

      // Splash mínimo para o banco estar pronto
      setTimeout(() => setIsLoading(false), 1200);
    } catch (error: any) {
      console.error('❌ Erro ao inicializar app:', error);
      setDbError(error.message || 'Erro ao inicializar banco de dados');
      setIsLoading(false);
    }
  }

  // ── tela de loading ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingCard}>
          <View style={styles.loadingIconCircle}>
            <MaterialIcons name="content-cut" size={36} color={C.blue} />
          </View>
          <Text style={styles.loadingTitle}>SmartBarber</Text>
          <Text style={styles.loadingSubtitle}>Preparando o sistema...</Text>
          <ActivityIndicator
            size="large"
            color={C.blue}
            style={{ marginTop: 24 }}
          />
        </View>
      </View>
    );
  }

  // ── tela de erro ─────────────────────────────────────────────────────────

  if (dbError) {
    return (
      <View style={styles.errorScreen}>
        <View style={styles.errorCard}>
          <View style={styles.errorIconCircle}>
            <MaterialIcons name="error-outline" size={40} color={C.red} />
          </View>
          <Text style={styles.errorTitle}>Erro ao Inicializar</Text>
          <Text style={styles.errorMessage}>{dbError}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setDbError(null);
              setIsLoading(true);
              initializeApp();
            }}
            activeOpacity={0.85}
          >
            <MaterialIcons name="refresh" size={18} color="#fff" />
            <Text style={styles.retryBtnText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── app ───────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Routes />

      {/* ── Menu de Desenvolvimento (apenas __DEV__) ── */}
      {__DEV__ && (
        <>
          <TouchableOpacity
            style={styles.devFab}
            onPress={() => setShowDevMenu(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.devFabText}>🔧</Text>
          </TouchableOpacity>

          <Modal
            visible={showDevMenu}
            animationType="slide"
            transparent
            onRequestClose={() => setShowDevMenu(false)}
          >
            <View style={styles.devOverlay}>
              <View style={styles.devSheet}>
                <View style={styles.devSheetHandle} />

                <Text style={styles.devSheetTitle}>Menu de Desenvolvimento</Text>

                <ScrollView showsVerticalScrollIndicator={false}>

                  {/* Seed */}
                  <DevMenuItem
                    icon="🌱"
                    label="Adicionar Dados de Teste"
                    sub="Criar usuários de exemplo"
                    onPress={() => {
                      try {
                        dbUtils.seed();
                        Alert.alert('Sucesso', 'Dados de teste adicionados!\nVeja o console para as credenciais.');
                      } catch (e: any) { Alert.alert('Erro', e.message); }
                    }}
                  />

                  {/* Stats */}
                  <DevMenuItem
                    icon="📊"
                    label="Ver Estatísticas"
                    sub="Informações do banco de dados"
                    onPress={() => {
                      try {
                        const s = dbUtils.stats();
                        Alert.alert(
                          'Estatísticas do Banco',
                          `👥 Usuários: ${s.users}\n🔑 Sessões: ${s.sessions}\n⚙️ Configurações: ${s.settings}\n📅 Agendamentos: ${s.appointments}\n💾 Tamanho: ${s.databaseSize.totalKB} KB`
                        );
                      } catch (e: any) { Alert.alert('Erro', e.message); }
                    }}
                  />

                  {/* Integridade */}
                  <DevMenuItem
                    icon="🔍"
                    label="Verificar Integridade"
                    sub="Checar consistência dos dados"
                    onPress={() => {
                      try {
                        const ok = dbUtils.check();
                        Alert.alert(
                          ok ? 'Integridade OK' : 'Integridade Falhou',
                          ok ? 'O banco de dados está íntegro!' : 'Foram encontrados problemas no banco.'
                        );
                      } catch (e: any) { Alert.alert('Erro', e.message); }
                    }}
                  />

                  {/* Otimizar */}
                  <DevMenuItem
                    icon="⚡"
                    label="Otimizar Banco"
                    sub="Compactar e melhorar performance"
                    onPress={() => {
                      try {
                        dbUtils.optimize();
                        Alert.alert('Sucesso', 'Banco de dados otimizado!\nVeja o console para detalhes.');
                      } catch (e: any) { Alert.alert('Erro', e.message); }
                    }}
                  />

                  {/* Backup */}
                  <DevMenuItem
                    icon="💾"
                    label="Fazer Backup"
                    sub="Exportar dados atuais para o console"
                    onPress={() => {
                      try {
                        const backup = dbUtils.backup();
                        console.log('💾 Backup:', backup);
                        Alert.alert('Sucesso', 'Backup criado!\nVeja o console para os dados.');
                      } catch (e: any) { Alert.alert('Erro', e.message); }
                    }}
                  />

                  <View style={styles.devDivider} />

                  {/* Limpar dados */}
                  <DevMenuItem
                    icon="🧹"
                    label="Limpar Todos os Dados"
                    sub="Deleta dados, mantém estrutura"
                    variant="warning"
                    onPress={() => {
                      Alert.alert(
                        'Confirmar',
                        'Isso vai deletar TODOS os dados, mas manter a estrutura do banco. Deseja continuar?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Limpar',
                            style: 'destructive',
                            onPress: () => {
                              try {
                                dbUtils.clear();
                                Alert.alert('Sucesso', 'Todos os dados foram limpos!');
                              } catch (e: any) { Alert.alert('Erro', e.message); }
                            },
                          },
                        ]
                      );
                    }}
                  />

                  {/* Resetar banco */}
                  <DevMenuItem
                    icon="🔄"
                    label="Resetar Banco de Dados"
                    sub="⚠️ DELETA TUDO e recria do zero"
                    variant="danger"
                    onPress={() => {
                      Alert.alert(
                        'ATENÇÃO',
                        'Isso vai DELETAR e RECRIAR todo o banco!\n\nTODOS os dados serão PERMANENTEMENTE perdidos!\n\nDeseja continuar?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'RESETAR',
                            style: 'destructive',
                            onPress: () => {
                              try {
                                dbUtils.reset();
                                setShowDevMenu(false);
                                setIsLoading(true);
                                initializeApp();
                              } catch (e: any) { Alert.alert('Erro', e.message); }
                            },
                          },
                        ]
                      );
                    }}
                  />

                  <View style={{ height: 16 }} />
                </ScrollView>

                {/* Fechar */}
                <TouchableOpacity
                  style={styles.devCloseBtn}
                  onPress={() => setShowDevMenu(false)}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="close" size={18} color="#fff" />
                  <Text style={styles.devCloseBtnText}>Fechar</Text>
                </TouchableOpacity>

                <View style={{ height: Platform.OS === 'ios' ? 34 : 16 }} />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

// ── Componente interno: item do menu dev ─────────────────────────────────────

function DevMenuItem({
  icon,
  label,
  sub,
  variant,
  onPress,
}: {
  icon: string;
  label: string;
  sub: string;
  variant?: 'warning' | 'danger';
  onPress: () => void;
}) {
  const bg =
    variant === 'danger'  ? C.red    + '15' :
    variant === 'warning' ? C.yellow + '15' :
    C.surface;

  const borderColor =
    variant === 'danger'  ? C.red    + '50' :
    variant === 'warning' ? C.yellow + '50' :
    C.border;

  const labelColor =
    variant === 'danger'  ? C.red    :
    variant === 'warning' ? C.yellow :
    C.textPrimary;

  return (
    <TouchableOpacity
      style={[styles.devItem, { backgroundColor: bg, borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.devItemIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.devItemLabel, { color: labelColor }]}>{label}</Text>
        <Text style={styles.devItemSub}>{sub}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={18} color={C.textMuted} />
    </TouchableOpacity>
  );
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // Loading
  loadingScreen: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: C.border,
  },
  loadingIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.blue + '15',
    borderWidth: 2,
    borderColor: C.blue + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: C.textPrimary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: C.textMuted,
    fontWeight: '500',
  },

  // Error
  errorScreen: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: C.border,
  },
  errorIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.red + '15',
    borderWidth: 2,
    borderColor: C.red + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.red,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.blue,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    gap: 8,
    width: '100%',
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Dev FAB
  devFab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  devFabText: {
    fontSize: 22,
  },

  // Dev Sheet
  devOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  devSheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: C.border,
  },
  devSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  devSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Dev Item
  devItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    gap: 14,
  },
  devItemIcon: {
    fontSize: 26,
    width: 34,
    textAlign: 'center',
  },
  devItemLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  devItemSub: {
    fontSize: 12,
    color: C.textMuted,
  },

  devDivider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 12,
  },

  // Dev close
  devCloseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: C.border,
    gap: 8,
  },
  devCloseBtnText: {
    color: C.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
});