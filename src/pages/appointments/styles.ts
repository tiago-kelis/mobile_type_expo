import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  section: {
    margin: 20,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },

  // Fila de Hoje
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  queuePosition: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7d8c9dff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  positionNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  queueInfo: {
    flex: 1,
  },

  queueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  queueService: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },

  queueTime: {
    fontSize: 14,
    color: '#11ae26ff',
    fontWeight: '500',
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    color: '#7e0d0dff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Meus Agendamentos
  appointmentCard: {
    backgroundColor: '#fff',
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 8,
  },

  appointmentService: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },

  appointmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },

  appointmentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },

  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },

  cancelButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Estados vazios
  emptyState: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },

  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  picker: {
    height: 50,
  },

  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e7f3ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
    marginBottom: 20,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#17a2b8',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
    color: '#17a2b8',
    lineHeight: 18,
  },

  modalButtons: {
    flexDirection: 'row',
    paddingVertical: 20,
    gap: 12,
  },

  cancelModalButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  createButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  createButtonDisabled: {
    opacity: 0.6,
  },

  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});