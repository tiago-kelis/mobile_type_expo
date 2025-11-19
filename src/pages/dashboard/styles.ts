import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#192542ff',
    paddingBottom: 30,
  },

  // ========== HEADER ==========
  header: {
    backgroundColor: '#03112bff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#76ca16ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  greetingText: {
    fontSize: 16,
    color: '#a09c9cff',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b89d8ff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#3a3f5dff',
  },
  avatarContainer: {
    backgroundColor: '#1e3a45ff',
    borderRadius: 35,
    padding: 5,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#387157ff',
  },

  // ========== SECTIONS ==========
  section: {
    paddingHorizontal: 20, // ✅ Reduzido para dar mais espaço aos cards
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4e5684ff',
    marginBottom: 8,
  },

  // ========== CARDS GRID - ✅ MODIFICADO PARA 2 COLUNAS ==========
  cardsGrid: {
    flexDirection: 'row',        // ✅ Direção em linha
    flexWrap: 'wrap',           // ✅ Quebra linha quando necessário
    justifyContent: 'space-between', // ✅ Distribui espaço entre cards
    gap: 15,                    // ✅ Espaçamento entre cards
  },
  card: {
    backgroundColor: '#03151cff',
    borderRadius: 15,
    padding: 12,                // ✅ Aumentei padding
    width: '48%',              // ✅ NOVO: Cada card ocupa 48% da largura (2 por linha)
    aspectRatio: 1.2,          // ✅ NOVO: Proporção para manter altura consistente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    justifyContent: 'space-between', // ✅ Distribui conteúdo verticalmente
  },
  cardHome: {
    borderLeftWidth: 6,
    borderLeftColor: '#00ffd0ff',
    borderWidth: 0.2,
    borderColor: "#1ebe3cff"
  },
  cardProfile: {
    borderLeftWidth: 6,
    borderLeftColor: '#00ffd0ff',
    borderWidth: 0.2,
    borderColor: "#1ebe3cff"
  },
  // ✅ NOVO: Estilo para card de agendamentos
  cardAppointments: {
    borderLeftWidth: 6,
    borderLeftColor: '#ff6b35',
    borderWidth: 0.2,
    borderColor: "#ff6b35"
  },
  cardIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#3641a2ff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,           // ✅ Aumentei margem
  },
  cardTitle: {
    fontSize: 18,             // ✅ Reduzi um pouco para caber melhor
    fontWeight: 'bold',
    color: '#1881ddff',
    marginBottom: 6,          // ✅ Reduzi margem
  },
  cardDescription: {
    fontSize: 12,             // ✅ Reduzi para caber melhor
    color: '#2f6f44ff',
    lineHeight: 16,           // ✅ Reduzi line-height
    flex: 1,                 // ✅ NOVO: Ocupa espaço restante
  },
  cardArrow: {
    position: 'absolute',
    top: 15,                 // ✅ Ajustei posição
    right: 15,               // ✅ Ajustei posição
  },

  // ========== QUICK ACTIONS ==========
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#134055ff',
    padding: 5,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#d6cdcdff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    color: '#11b8e7ff',
    marginLeft: 15,
    fontWeight: '500',
  },

  // ========== STATS ==========
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#081657ff',
    borderRadius: 12,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#ede2e2ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#bdadadff',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },

  // ========== LOGOUT ==========
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',    
    backgroundColor: '#062a47ff',
    marginHorizontal: 90,
    marginTop: 18,
    padding: 3,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  logoutButtonText: {  
    fontWeight: 'bold',
    color: '#dc3545',
    marginLeft: 5,
  },

  // ========== FOOTER ==========
  footer: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#3b9b52ff',
  },
  footerVersion: {
    fontSize: 12,
    color: '#444242ff',
  },

  // ========== USER BADGE ==========
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#007bff',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },

  userBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: -8,
    letterSpacing: 0.5,
  },
});