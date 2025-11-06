import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
    paddingBottom: 30,
  },

  // ========== HEADER ==========
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
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
    color: '#666',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
  },
  avatarContainer: {
    backgroundColor: '#f0f8ff',
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
    color: '#666',
  },

  // ========== SECTIONS ==========
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  // ========== CARDS GRID ==========
  cardsGrid: {
    gap: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  cardHome: {
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  cardProfile: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  cardIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cardArrow: {
    position: 'absolute',
    top: 20,
    right: 20,
  },

  // ========== QUICK ACTIONS ==========
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 25,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
    marginLeft: 10,
  },

  // ========== FOOTER ==========
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#28a745',
    marginBottom: 5,
  },
  footerVersion: {
    fontSize: 12,
    color: '#999',
  },
});