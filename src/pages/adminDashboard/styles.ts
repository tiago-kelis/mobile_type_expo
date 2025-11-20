import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

export const styles = StyleSheet.create({
  // Container Principal
  container: {
    flexGrow: 1,
    backgroundColor: '#0b2e51ff',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    
  },

  // Header
  header: {
    backgroundColor: '#121e44ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#ec8b0dff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  greetingText: {
    fontSize: 16,
    color: '#606bc1ff',
    marginBottom: 4,
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8e663eff',
    marginBottom: 8,
  },

  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48292cff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  adminBadgeText: {
    color: '#cdc2c2ff',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },

  avatarContainer: {
    backgroundColor: '#1b2f43ff',
    borderRadius: 50,
    padding: 8,
    borderWidth: 3,
    borderColor: '#dc3545',
  },

  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,    
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#686666ff',
    fontWeight: '500',
  },

  // Seções
  section: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#854817ff',
    marginBottom: 16,
    paddingLeft: 4,
  },

  // Grid de Estatísticas
  statsGrid: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  statCard: {
    flex: isSmallScreen ? 0 : 1,
    backgroundColor: '#213549ff',
    borderRadius: 12,
    padding: 5,
    alignItems: 'center',
    marginHorizontal: isSmallScreen ? 0 : 4,
    marginBottom: isSmallScreen ? 12 : 0,
    shadowColor: '#e7d2d2ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  statCardBlue: {
    borderTopWidth: 6,
    borderTopColor: '#007bff',
  },

  statCardGreen: {
    borderTopWidth: 6,
    borderTopColor: '#28a745',
  },

  statCardOrange: {
    borderTopWidth: 6,
    borderTopColor: '#ffc107',
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b21919ff',
    marginTop: 8,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#7b7777ff',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Grid de Cards
  cardsGrid: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    flex: isSmallScreen ? 0 : 1,
    backgroundColor: '#141d57ff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: isSmallScreen ? 0 : 4,
    marginBottom: isSmallScreen ? 12 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },

  cardUsers: {
    borderLeftWidth: 5,
    borderLeftColor: '#00ff48ff',
  },

  cardReports: {
    borderLeftWidth: 5,
    borderLeftColor: '#28a745',
  },

  cardSettings: {
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
  },

  cardSecurity: {
    borderLeftWidth: 5,
    borderLeftColor: '#dc3545',
  },

  cardIcon: {
    alignItems: 'center',
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#744e3dff',
    marginBottom: 6,
    textAlign: 'center',
  },

  cardDescription: {
    fontSize: 13,
    color: '#4c4b4bff',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },

  cardArrow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
  },

  // Ações Rápidas
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#233150ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#cec9c9ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#e9ecef',
  },

  quickActionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#3d75a7ff',
  },

  // Botão de Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b3a5bff',
    padding: 8,
    borderRadius: 12,
    marginTop: 5,
    marginHorizontal: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#dc3545',
  },

  logoutButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },

  // Rodapé
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  footerVersion: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: -25,
    marginBottom: 60,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#092745ff',
    
    
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#212c4fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d15c13ff',
  },

  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#d10a0aff',
  },

  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Items de Usuário no Modal
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#24353eff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 25,    
    shadowColor: '#bcb7b7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userAvatar: {
    marginRight: 16,
    backgroundColor: '#1e2935ff',
    borderRadius: 25,
    padding: 8,
  },

  userDetails: {
    flex: 1,
  },

  userNameModal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#099441ff',
    marginBottom: 4,
  },

  userEmailModal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },

  userBadge: {
    alignSelf: 'flex-start',
  },

  userBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },

  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  promoteButton: {
    backgroundColor: '#d4edda',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },

  demoteButton: {
    backgroundColor: '#fff3cd',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },

  deleteButton: {
    backgroundColor: '#f8d7da',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },


  // styles.ts - adicionar estes estilos

appointmentSummary: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: '#2b5874ff',
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#e9ecef',
},

summaryItem: {
  alignItems: 'center',
},

summaryNumber: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#b9d007ff',
},

summaryLabel: {
  fontSize: 12,
  color: '#a29a9aff',
  marginTop: 4,
},

appointmentItem: {
  backgroundColor: '#2e4351ff',
  padding: 10,
  borderRadius: 12,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},

appointmentHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 8,
},

appointmentInfo: {
  flex: 1,
},

appointmentUser: {
  fontSize: 16,
  fontWeight: '900',
  color: '#f1ebebff',
  marginBottom: 4,
},

appointmentService: {
  fontSize: 25,
  fontWeight: "900",
  color: '#8199afff',
  marginBottom: 4,
},

appointmentDateTime: {
  fontSize: 15,
  color: '#118020ff',
},

appointmentQueue: {
  backgroundColor: '#094655ff',
  borderRadius: 20,
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: "rgba(26, 235, 26, 0.87)"
},

queueNumber: {
  color: '#fff',
  fontSize: 25,
  fontWeight: 'bold',
},

appointmentDescription: {
  fontSize: 14,
  color: '#666',
  fontStyle: 'italic',
  marginBottom: 12,
},

appointmentActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  
},

actionButtons: {
  flexDirection: 'row',  
  gap: 8,
},

actionButton: {
  backgroundColor: '#4b1881ff',
  borderRadius: 20,
  padding: 8,
},

emptyState: {   
  alignItems: "center", 
  textAlign: "center",
  paddingHorizontal: 10,
  paddingVertical: 2,
  borderRadius: 12,  
},

emptyText: {
  fontSize: 16,
  color: '#f9f5f5ff',
  
},



// ✅ ESTILOS PARA OS NOVOS COMPONENTES

// Estatísticas de período
periodsStats: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 15,
  paddingHorizontal: 10,
},

periodItem: {
  flex: 1,
  alignItems: 'center',
  paddingVertical: 12,
  marginHorizontal: 5,
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e9ecef',
},

periodLabel: {
  fontSize: 12,
  fontWeight: '600',
  color: '#6c757d',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},

periodValue: {
  fontSize: 16,
  fontWeight: '700',
  color: '#212529',
  marginTop: 4,
},

periodSub: {
  fontSize: 12,
  color: '#28a745',
  marginTop: 2,
  fontWeight: '500',
},

// Card de histórico
cardHistory: {
  backgroundColor: '#fff',
  borderLeftColor: '#6f42c1',
  borderLeftWidth: 4,
},

// Modal de histórico
completedItem: {
  borderLeftColor: '#28a745',
  borderLeftWidth: 3,
  backgroundColor: '#f8fff9',
},

canceledItem: {
  borderLeftColor: '#dc3545',
  borderLeftWidth: 3,
  backgroundColor: '#fff8f8',
},

statusBadgeHistory: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  gap: 4,
},

statusTextHistory: {
  fontSize: 12,
  fontWeight: '600',
  color: '#fff',
},

appointmentDate: {
  fontSize: 12,
  color: '#6c757d',
  fontStyle: 'italic',
  marginTop: 8,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: '#e9ecef',
},



// Estilos específicos para diferentes tipos de status
statusBadge: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 80,
},

statusText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#fff',
  textAlign: 'center',
},

// Cores específicas para diferentes status
agendadoStatus: {
  backgroundColor: '#007bff',
},

emAtendimentoStatus: {
  backgroundColor: '#ffc107',
},

concluidoStatus: {
  backgroundColor: '#28a745',
},

canceladoStatus: {
  backgroundColor: '#dc3545',
},

// Botões de ação específicos
startButton: {
  backgroundColor: '#ffc107',
  borderColor: '#ffc107',
},

completeButton: {
  backgroundColor: '#28a745',
  borderColor: '#28a745',
},

// Seção de resumo no dashboard
dashboardSummary: {
  backgroundColor: '#fff',
  marginHorizontal: 15,
  marginVertical: 10,
  borderRadius: 12,
  padding: 15,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},

summaryTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#212529',
  marginBottom: 10,
  textAlign: 'center',
},

summaryGrid: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
},

summaryCard: {
  alignItems: 'center',
  paddingVertical: 10,
  minWidth: '30%',
},

summaryValue: {
  fontSize: 20,
  fontWeight: '700',
  color: '#007bff',
},

summaryDescription: {
  fontSize: 11,
  color: '#6c757d',
  textAlign: 'center',
  marginTop: 4,
},

statCardYellow: {
  borderTopWidth: 6,
    borderTopColor: '#c2e110ff',

}

});