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
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Routes from './src/routers';
import { api } from './src/api/client';

// ── Tokens fixos para loading/error (antes do ThemeProvider montar) ──────────
const C = {
  bg:          '#0f172a',
  surface:     '#1e293b',
  border:      '#334155',
  textPrimary: '#f1f5f9',
  textMuted:   '#64748b',
  textSecondary: '#94a3b8',
  teal:  '#14b8a6',
  blue:  '#3b82f6',
  yellow:'#f59e0b',
  red:   '#ef4444',
};

// ── Componente interno que consome os contexts ────────────────────────────────
function AppContent() {
  const { theme } = useTheme();
  const { isLoading: authLoading } = useAuth();

  const [apiReady, setApiReady]   = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);
  const [showDevMenu, setShowDevMenu] = useState(false);

  useEffect(() => {
    checkApi();
  }, []); // ✅ array vazio — executa só uma vez

  async function checkApi() {
    try {
      console.log('🚀 Verificando conexão com a API...');
      await api.get('/health');
      console.log('✅ API conectada!');
      setApiReady(true);
      setApiError(null); // ✅ limpar erro anterior
    } catch (error: any) {
      console.error('❌ API indisponível:', error.message);
      setApiError('Não foi possível conectar ao servidor.\nVerifique se a API está rodando.');
      setApiReady(false);
    }
  }


  // ── loading ──────────────────────────────────────────────────────────────

  if (authLoading || (!apiReady && !apiError)) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingCard}>
          <View style={styles.loadingIconCircle}>
            <MaterialIcons name="local-hospital" size={36} color={C.teal} />
          </View>
          <Text style={styles.loadingTitle}>SmartClínica</Text>
          <Text style={styles.loadingSubtitle}>Conectando ao sistema...</Text>
          <ActivityIndicator size="large" color={C.teal} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  // ── erro de conexão ──────────────────────────────────────────────────────

  if (apiError) {
    return (
      <View style={styles.errorScreen}>
        <View style={styles.errorCard}>
          <View style={styles.errorIconCircle}>
            <MaterialIcons name="wifi-off" size={40} color={C.red} />
          </View>
          <Text style={styles.errorTitle}>Sem Conexão</Text>
          <Text style={styles.errorMessage}>{apiError}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => { setApiError(null); checkApi(); }}
            activeOpacity={0.85}
          >
            <MaterialIcons name="refresh" size={18} color="#fff" />
            <Text style={styles.retryBtnText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── app ──────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
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

                  <DevMenuItem
                    icon="🌐"
                    label="Verificar API"
                    sub="Testar conexão com o servidor"
                    onPress={async () => {
                      try {
                        await api.get('/health');
                        Alert.alert('✅ API Online', 'Servidor respondendo normalmente.');
                      } catch (e: any) {
                        Alert.alert('❌ API Offline', e.message);
                      }
                    }}
                  />

                  <DevMenuItem
                    icon="👤"
                    label="Info do Usuário Logado"
                    sub="Ver dados da sessão atual"
                    onPress={() => {
                      // lido via AuthContext no componente filho
                      Alert.alert('Dev', 'Veja o AuthContext no console');
                    }}
                  />

                  <View style={styles.devDivider} />

                  <DevMenuItem
                    icon="🏥"
                    label="Sobre"
                    sub="SmartClínica v2.0.0 — MySQL + API"
                    onPress={() =>
                      Alert.alert(
                        'SmartClínica v2.0.0',
                        'Backend: Node.js + Express\nBanco: MySQL\nApp: React Native + Expo'
                      )
                    }
                  />

                  <View style={{ height: 16 }} />
                </ScrollView>

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

// ── Root com Providers ────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// ── Componente interno: item do menu dev ──────────────────────────────────────

function DevMenuItem({
  icon, label, sub, variant, onPress,
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

// ── Estilos ───────────────────────────────────────────────────────────────────

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
    backgroundColor: C.teal + '15',
    borderWidth: 2,
    borderColor: C.teal + '40',
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
    backgroundColor: C.teal,
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
  devFabText: { fontSize: 22 },

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