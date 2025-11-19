import React, { useEffect, useState } from 'react';
import { debugAllUsers, forceCreateAdmin, makeUserAdmin } from './src/database/services/userServices';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Routes from './src/routers';
import { initDatabase } from './src/database/initDB';
import { dbUtils } from './src/database/utils';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [showDevMenu, setShowDevMenu] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);


  async function initializeApp() {
  try {
    console.log('🚀 Iniciando aplicação...');
    
    // Inicializar banco de dados
    const success = initDatabase();
    
    if (success) {
      console.log('✅ Banco de dados pronto!');
      
      // ✅ ADICIONADO: Debug e configuração de admin
      console.log('🔍 Verificando usuários...');
      debugAllUsers();
      
      // ✅ Garantir que existe um admin
      const adminCreated = forceCreateAdmin();
      if (adminCreated) {
        console.log('✅ Admin padrão garantido: admin@sistema.com / admin123');
      }
      
      // ✅ ADICIONAL: Promover usuário específico se quiser
      const promoted = makeUserAdmin('adm01@gmail.com');
      if (promoted) {
        console.log('✅ adm01@gmail.com promovido para admin!');
      }
      
      // ✅ Debug final para confirmar admins
      console.log('👑 Verificando admins finais...');
      debugAllUsers();
      
      // Mostrar estatísticas
      dbUtils.stats();
    }
    
    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
  } catch (error: any) {
    console.error('❌ Erro ao inicializar app:', error);
    setDbError(error.message || 'Erro ao inicializar banco de dados');
    setIsLoading(false);
  }
}

  // Tela de loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Iniciando aplicação...</Text>
        <Text style={styles.loadingSubtext}>Preparando banco de dados</Text>
      </View>
    );
  }

  // Tela de erro
  if (dbError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Erro ao Inicializar</Text>
        <Text style={styles.errorText}>{dbError}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setDbError(null);
            setIsLoading(true);
            initializeApp();
          }}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // App normal
  return (
    <View style={{ flex: 1 }}>
      <Routes />
      
      {/* Menu de Desenvolvimento (apenas em modo dev) */}
      {__DEV__ && (
        <>
          <TouchableOpacity 
            style={styles.devButton}
            onPress={() => setShowDevMenu(!showDevMenu)}
          >
            <Text style={styles.devButtonText}>🔧</Text>
          </TouchableOpacity>
          
          <Modal
            visible={showDevMenu}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowDevMenu(false)}
          >
            <View style={styles.devMenuOverlay}>
              <View style={styles.devMenu}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.devMenuTitle}>🛠️ Menu de Desenvolvimento</Text>
                  
                  {/* Seed Database */}
                  <TouchableOpacity 
                    style={styles.devMenuItem}
                    onPress={() => {
                      try {
                        dbUtils.seed();
                        Alert.alert('✅ Sucesso', 'Dados de teste adicionados!\n\nVeja o console para as credenciais.');
                      } catch (error: any) {
                        Alert.alert('❌ Erro', error.message);
                      }
                    }}
                  >
                    <Text style={styles.devMenuItemIcon}>🌱</Text>
                    <View style={styles.devMenuItemContent}>
                      <Text style={styles.devMenuItemText}>Adicionar Dados de Teste</Text>
                      <Text style={styles.devMenuItemSubtext}>Criar 5 usuários de exemplo</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Ver Estatísticas */}
                  <TouchableOpacity 
                    style={styles.devMenuItem}
                    onPress={() => {
                      try {
                        const stats = dbUtils.stats();
                        Alert.alert(
                          '📊 Estatísticas do Banco',
                          `👥 Usuários: ${stats.users}\n🔑 Sessões: ${stats.sessions}\n⚙️ Configurações: ${stats.settings}\n💾 Tamanho: ${stats.databaseSize.totalKB} KB`,
                          [{ text: 'OK' }]
                        );
                      } catch (error: any) {
                        Alert.alert('❌ Erro', error.message);
                      }
                    }}
                  >
                    <Text style={styles.devMenuItemIcon}>📊</Text>
                    <View style={styles.devMenuItemContent}>
                      <Text style={styles.devMenuItemText}>Ver Estatísticas</Text>
                      <Text style={styles.devMenuItemSubtext}>Informações do banco de dados</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Verificar Integridade */}
                  <TouchableOpacity 
                    style={styles.devMenuItem}
                    onPress={() => {
                      try {
                        const isOk = dbUtils.check();
                        Alert.alert(
                          isOk ? '✅ Integridade OK' : '❌ Integridade Falhou',
                          isOk ? 'O banco de dados está íntegro!' : 'Foram encontrados problemas no banco.',
                          [{ text: 'OK' }]
                        );
                      } catch (error: any) {
                        Alert.alert('❌ Erro', error.message);
                      }
                    }}
                  >
                    <Text style={styles.devMenuItemIcon}>🔍</Text>
                    <View style={styles.devMenuItemContent}>
                      <Text style={styles.devMenuItemText}>Verificar Integridade</Text>
                      <Text style={styles.devMenuItemSubtext}>Checar consistência dos dados</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Otimizar Banco */}
                  <TouchableOpacity 
                    style={styles.devMenuItem}
                    onPress={() => {
                      try {
                        dbUtils.optimize();
                        Alert.alert('✅ Sucesso', 'Banco de dados otimizado!\n\nVeja o console para detalhes.');
                      } catch (error: any) {
                        Alert.alert('❌ Erro', error.message);
                      }
                    }}
                  >
                    <Text style={styles.devMenuItemIcon}>🔧</Text>
                    <View style={styles.devMenuItemContent}>
                      <Text style={styles.devMenuItemText}>Otimizar Banco</Text>
                      <Text style={styles.devMenuItemSubtext}>Compactar e melhorar performance</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Fazer Backup */}
                  <TouchableOpacity 
                    style={styles.devMenuItem}
                    onPress={() => {
                      try {
                        const backup = dbUtils.backup();
                        console.log('💾 Backup criado:', backup);
                        Alert.alert('✅ Sucesso', 'Backup criado!\n\nVeja o console para os dados.');
                      } catch (error: any) {
                        Alert.alert('❌ Erro', error.message);
                      }
                    }}
                  >
                    <Text style={styles.devMenuItemIcon}>💾</Text>
                    <View style={styles.devMenuItemContent}>
                      <Text style={styles.devMenuItemText}>Fazer Backup</Text>
                      <Text style={styles.devMenuItemSubtext}>Exportar dados atuais</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Divisor */}
                  <View style={styles.devMenuDivider} />
                  
                  {/* Limpar Dados */}
                  <TouchableOpacity 
                    style={[styles.devMenuItem, styles.devMenuItemWarning]}
                    onPress={() => {
                      Alert.alert(
                        '⚠️ Confirmar',
                        'Isso vai deletar TODOS os dados, mas manter a estrutura do banco.\n\nDeseja continuar?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: 'Limpar', 
                            style: 'destructive',
                            onPress: () => {
                              try {
                                dbUtils.clear();
                                Alert.alert('✅ Sucesso', 'Todos os dados foram limpos!');
                              } catch (error: any) {
                                Alert.alert('❌ Erro', error.message);
                              }
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.devMenuItemIcon}>🧹</Text>
                    <View style={styles.devMenuItemContent}>
                      <Text style={[styles.devMenuItemText, styles.devMenuItemTextWarning]}>
                        Limpar Todos os Dados
                      </Text>
                      <Text style={styles.devMenuItemSubtext}>Deletar dados, manter estrutura</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {/* Resetar Banco */}
                  <TouchableOpacity 
                    style={[styles.devMenuItem, styles.devMenuItemDanger]}
                    onPress={() => {
                      Alert.alert(
                        '🚨 ATENÇÃO',
                        'Isso vai DELETAR e RECRIAR todo o banco de dados!\n\nTODOS os dados serão PERMANENTEMENTE perdidos!\n\nDeseja continuar?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: 'RESETAR', 
                            style: 'destructive',
                            onPress: () => {
                              try {
                                dbUtils.reset();
                                Alert.alert('✅ Sucesso', 'Banco de dados resetado!\n\nO app será reiniciado.');
                                // Reiniciar app
                                setIsLoading(true);
                                setShowDevMenu(false);
                                initializeApp();
                              } catch (error: any) {
                                Alert.alert('❌ Erro', error.message);
                              }
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.devMenuItemIcon}>🔄</Text>
                    <View style={styles.devMenuItemContent}>
                      <Text style={[styles.devMenuItemText, styles.devMenuItemTextDanger]}>
                        Resetar Banco de Dados
                      </Text>
                      <Text style={styles.devMenuItemSubtext}>⚠️ DELETA TUDO e recria</Text>
                    </View>
                  </TouchableOpacity>
                  
                </ScrollView>
                
                {/* Botão Fechar */}
                <TouchableOpacity 
                  style={styles.devMenuCloseButton}
                  onPress={() => setShowDevMenu(false)}
                >
                  <MaterialIcons name="close" size={24} color="#fff" />
                  <Text style={styles.devMenuCloseText}>Fechar Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  
  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Dev Button
  devButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  devButtonText: {
    fontSize: 30,
  },
  
  // Dev Menu
  devMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  devMenu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  devMenuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  devMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  devMenuItemIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  devMenuItemContent: {
    flex: 1,
  },
  devMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  devMenuItemSubtext: {
    fontSize: 12,
    color: '#666',
  },
  devMenuItemWarning: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  devMenuItemTextWarning: {
    color: '#856404',
  },
  devMenuItemDanger: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  devMenuItemTextDanger: {
    color: '#721c24',
  },
  devMenuDivider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 15,
  },
  devMenuCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  devMenuCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});