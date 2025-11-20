import { StyleSheet, Dimensions } from 'react-native';

// ✅ NOVO: Obter dimensões da tela
const { width: screenWidth } = Dimensions.get('window');

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
    paddingHorizontal: 15, // ✅ REDUZIDO: Mais espaço para os cards
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e5684ff',
    marginBottom: 15,
  },

  // ========== CARDS GRID RESPONSIVO ==========
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10, // ✅ REDUZIDO: Menos gap para mais espaço
    alignItems: 'stretch',
  },
  
  card: {
    backgroundColor: '#03151cff',
    borderRadius: 15,
    padding: 12,
    // ✅ NOVO: Largura responsiva
    width: screenWidth < 350 
      ? screenWidth - 50  // Tela pequena: quase toda largura
      : screenWidth < 500 
        ? (screenWidth - 50) * 0.48  // Tela média: 48% cada (2 por linha)
        : (screenWidth - 60) * 0.31, // Tela grande: 31% cada (3 por linha)
    minHeight: 140, // ✅ NOVO: Altura mínima
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    justifyContent: 'space-between',
    marginBottom: 10, // ✅ NOVO: Espaço entre linhas
  },

  cardHome: {
    borderLeftWidth: 4, // ✅ REDUZIDO
    borderLeftColor: '#00ffd0ff',
    borderWidth: 0.2,
    borderColor: "#1ebe3cff"
  },
  cardProfile: {
    borderLeftWidth: 4, // ✅ REDUZIDO
    borderLeftColor: '#00ffd0ff',
    borderWidth: 0.2,
    borderColor: "#1ebe3cff"
  },
  cardAppointments: {
    borderLeftWidth: 4, // ✅ REDUZIDO
    borderLeftColor: '#ff6b35',
    borderWidth: 0.2,
    borderColor: "#ff6b35"
  },
  
  cardIcon: {
    width: 45, // ✅ AUMENTADO
    height: 45, // ✅ AUMENTADO
    backgroundColor: '#3641a2ff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  cardTitle: {
    fontSize: screenWidth < 350 ? 14 : 16, // ✅ NOVO: Fonte responsiva
    fontWeight: 'bold',
    color: '#1881ddff',
    marginBottom: 6,
  },
  
  cardDescription: {
    fontSize: screenWidth < 350 ? 10 : 12, // ✅ NOVO: Fonte responsiva
    color: '#2f6f44ff',
    lineHeight: screenWidth < 350 ? 14 : 16, // ✅ NOVO: Line-height responsivo
    flex: 1, // ✅ NOVO: Ocupa espaço restante
  },
  
  cardArrow: {
    position: 'absolute',
    top: 12,
    right: 12,
  },

  // ========== QUICK ACTIONS ==========
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#134055ff',
    padding: 12, // ✅ AUMENTADO
    borderRadius: 12,
    marginBottom: 12, // ✅ AUMENTADO
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

  // ========== STATS RESPONSIVO ==========
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8, // ✅ REDUZIDO
  },
  
  statCard: {
    flex: 1,
    backgroundColor: '#081657ff',
    borderRadius: 12,
    padding: 12, // ✅ AUMENTADO
    alignItems: 'center',
    shadowColor: '#ede2e2ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 90, // ✅ NOVO: Altura mínima
  },
  
  statValue: {
    fontSize: 14, // ✅ AUMENTADO
    fontWeight: 'bold',
    color: '#bdadadff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11, // ✅ REDUZIDO
    color: '#666',
    marginTop: 5,
    textAlign: 'center', // ✅ NOVO: Centralizado
  },

  // ========== LOGOUT RESPONSIVO ==========
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',    
    backgroundColor: '#062a47ff',
    marginHorizontal: screenWidth < 400 ? 50 : 90, // ✅ NOVO: Margem responsiva
    marginTop: 20, // ✅ AUMENTADO
    padding: 12, // ✅ AUMENTADO
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  logoutButtonText: {  
    fontWeight: 'bold',
    color: '#dc3545',
    marginLeft: 8, // ✅ AUMENTADO
    fontSize: 16,
  },

  // ========== FOOTER ==========
  footer: {
    alignItems: 'center',
    marginTop: 15, // ✅ AUMENTADO
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
    paddingHorizontal: 6, // ✅ AUMENTADO
    paddingVertical: 3, // ✅ AUMENTADO
    borderRadius: 12,
    marginTop: 6, // ✅ AUMENTADO
    alignSelf: 'flex-start', // ✅ NOVO: Alinha à esquerda
  },

  userBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4, // ✅ CORRIGIDO: Era -8, agora positivo
    letterSpacing: 0.5,
  },
});