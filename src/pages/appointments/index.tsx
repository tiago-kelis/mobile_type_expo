import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { styles } from './styles';
import {
  createAppointment,
  getUserAppointments,
  getAppointmentsByDate,
  cancelAppointmentById,
  SERVICE_TYPES,
  Appointment
} from '../../database/services/servicesAppointments';
import { RootStackParamList, UserData } from '../../routers/types';

type AppointmentsScreenRouteProp = RouteProp<RootStackParamList, 'Appointments'>;

export default function Appointments() {
  const navigation = useNavigation();
  const route = useRoute<AppointmentsScreenRouteProp>();
  const { user } = route.params as { user: UserData };

  // Estados
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [serviceType, setServiceType] = useState('consulta_geral');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [todayQueue, setTodayQueue] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const appointments = getUserAppointments(user.id);
      setMyAppointments(appointments);

      const today = new Date().toISOString().split('T')[0];
      const queue = getAppointmentsByDate(today);
      setTodayQueue(queue);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // Criar agendamento
  const handleCreateAppointment = () => {
    if (!serviceType || !description.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);

      const dateStr = selectedDate.toISOString().split('T')[0];
      const timeStr = selectedTime.toTimeString().split(' ')[0];

      const appointmentId = createAppointment(
        user.id,
        user.name,
        user.email,
        serviceType,
        description,
        dateStr,
        timeStr
      );

      if (appointmentId) {
        Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
        setShowNewAppointment(false);
        setDescription('');
        loadData();
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar agendamento
  const handleCancelAppointment = (appointmentId: number) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            const success = cancelAppointmentById(appointmentId);
            if (success) {
              Alert.alert('Sucesso', 'Agendamento cancelado');
              loadData();
            } else {
              Alert.alert('Erro', 'Não foi possível cancelar');
            }
          }
        }
      ]
    );
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  // Formatar hora
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return '#007bff';
      case 'em_atendimento': return '#ffc107';
      case 'concluido': return '#28a745';
      case 'cancelado': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Obter label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_atendimento': return 'Em Atendimento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  return (
        <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Agendamentos</Text>
            <TouchableOpacity onPress={() => setShowNewAppointment(true)}>
            <MaterialIcons name="add" size={24} color="#007bff" />
            </TouchableOpacity>
        </View>

        {/* Fila de Hoje */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕐 Fila de Hoje</Text>
            
            {todayQueue.length === 0 ? (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nenhum agendamento para hoje</Text>
            </View>
            ) : (
            todayQueue.map((appointment, index) => (
                <View key={appointment.id} style={styles.queueItem}>
                <View style={styles.queuePosition}>
                    <Text style={styles.positionNumber}>{appointment.queue_position}</Text>
                </View>
                <View style={styles.queueInfo}>
                    <Text style={styles.queueName}>{appointment.user_name}</Text>
                    <Text style={styles.queueService}>
                    {SERVICE_TYPES.find(s => s.value === appointment.service_type)?.label}
                    </Text>
                    <Text style={styles.queueTime}>
                    {formatTime(appointment.scheduled_time)}
                    </Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(appointment.status) }
                ]}>
                    <Text style={styles.statusText}>
                    {getStatusLabel(appointment.status)}
                    </Text>
                </View>
                </View>
            ))
            )}
        </View>

        {/* Meus Agendamentos */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Meus Agendamentos</Text>
            
            {myAppointments.length === 0 ? (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Você não tem agendamentos</Text>
            </View>
            ) : (
            myAppointments.map(appointment => (
                <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                    <Text style={styles.appointmentService}>
                    {SERVICE_TYPES.find(s => s.value === appointment.service_type)?.label}
                    </Text>
                    <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(appointment.status) }
                    ]}>
                    <Text style={styles.statusText}>
                        {getStatusLabel(appointment.status)}
                    </Text>
                    </View>
                </View>
                
                <Text style={styles.appointmentDescription}>
                    {appointment.description}
                </Text>
                
                <View style={styles.appointmentDetails}>
                    <View style={styles.detailItem}>
                    <MaterialIcons name="calendar-today" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        {formatDate(appointment.scheduled_date)}
                    </Text>
                    </View>
                    <View style={styles.detailItem}>
                    <MaterialIcons name="access-time" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        {formatTime(appointment.scheduled_time)}
                    </Text>
                    </View>
                    <View style={styles.detailItem}>
                    <MaterialIcons name="format-list-numbered" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        Posição: {appointment.queue_position}
                    </Text>
                    </View>
                </View>

                {appointment.status === 'agendado' && (
                    <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelAppointment(appointment.id)}
                    >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
                </View>
            ))
            )}
        </View>

        {/* Modal Novo Agendamento */}
            <Modal
            visible={showNewAppointment}
            animationType="slide"
            presentationStyle="pageSheet"
            >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowNewAppointment(false)}>
                    <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Novo Agendamento</Text>
                <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.modalContent}>
                {/* Tipo de Serviço */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Tipo de Serviço *</Text>
                    <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={serviceType}
                        onValueChange={setServiceType}
                        style={styles.picker}
                    >
                        {SERVICE_TYPES.map(service => (
                        <Picker.Item
                            key={service.value}
                            label={service.label}
                            value={service.value}
                        />
                        ))}
                    </Picker>
                    </View>
                </View>

                {/* Descrição */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Descrição do Atendimento *</Text>
                    <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Descreva brevemente o que precisa..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    />
                </View>

                {/* Data */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Data *</Text>
                    <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                    >
                    <MaterialIcons name="calendar-today" size={20} color="#007bff" />
                    <Text style={styles.dateButtonText}>
                        {selectedDate.toLocaleDateString('pt-BR')}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Hora */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Horário Preferencial *</Text>
                    <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowTimePicker(true)}
                    >
                    <MaterialIcons name="access-time" size={20} color="#007bff" />
                    <Text style={styles.dateButtonText}>
                        {selectedTime.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                        })}
                    </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Informações importantes */}
                <View style={styles.infoBox}>
                    <MaterialIcons name="info" size={20} color="#17a2b8" />
                    <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Informações Importantes:</Text>
                    <Text style={styles.infoText}>
                        • O atendimento seguirá ordem de chegada{'\n'}
                        • Chegue com 10 minutos de antecedência{'\n'}
                        • Traga documentos necessários{'\n'}
                        • Em caso de atraso, você pode perder a vez
                    </Text>
                    </View>
                </View>

                {/* Botões */}
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                    style={styles.cancelModalButton}
                    onPress={() => setShowNewAppointment(false)}
                    >
                    <Text style={styles.cancelModalButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={[styles.createButton, loading && styles.createButtonDisabled]}
                    onPress={handleCreateAppointment}
                    disabled={loading}
                    >
                    <Text style={styles.createButtonText}>
                        {loading ? 'Criando...' : 'Agendar'}
                    </Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setSelectedDate(date);
                }}
                />
            )}

            {/* Time Picker */}
            {showTimePicker && (
                <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={(event, time) => {
                    setShowTimePicker(false);
                    if (time) setSelectedTime(time);
                }}
                />
            )}
            </Modal>
        </ScrollView>
    )
}