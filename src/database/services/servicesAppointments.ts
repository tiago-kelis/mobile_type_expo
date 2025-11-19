import database from '../index';

export interface Appointment {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  service_type: string;
  description?: string;
  status: 'agendado' | 'em_atendimento' | 'concluido' | 'cancelado';
  queue_position: number;
  scheduled_date: string;
  scheduled_time: string;
  created_at: string;
  updated_at?: string;
  attended_at?: string;
}

// ✅ Tipos de serviços disponíveis
export const SERVICE_TYPES = [
  { value: 'corte_geral', label: 'Corte' },
  { value: 'barba_tecnico', label: 'Barba' },
  { value: 'pintar_cabelo', label: 'Pintar' },
  { value: 'sobrancelha', label: 'Fazer Sombrancelhas' },
  { value: 'outros', label: 'Outros' }
];

// ✅ Criar agendamento
export function createAppointment(
  userId: number,
  userName: string,
  userEmail: string,
  serviceType: string,
  description: string = '',
  scheduledDate: string,
  scheduledTime: string
): number {
  try {
    // Calcular próxima posição na fila
    const nextPosition = getNextQueuePosition(scheduledDate);
    
    const result = database.runSync(`
      INSERT INTO appointments (
        user_id, user_name, user_email, service_type, description,
        scheduled_date, scheduled_time, queue_position, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [
      userId, userName, userEmail, serviceType, description,
      scheduledDate, scheduledTime, nextPosition
    ]);
    
    console.log('✅ Agendamento criado com ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error);
    throw error;
  }
}

// ✅ Obter próxima posição na fila para uma data específica
function getNextQueuePosition(date: string): number {
  try {
    const result = database.getFirstSync<{ max_position: number }>(
      'SELECT COALESCE(MAX(queue_position), 0) as max_position FROM appointments WHERE scheduled_date = ? AND status != ?',
      [date, 'cancelado']
    );
    
    return (result?.max_position || 0) + 1;
  } catch (error) {
    console.error('❌ Erro ao calcular posição na fila:', error);
    return 1;
  }
}

// ✅ Buscar agendamentos por data (fila do dia)
export function getAppointmentsByDate(date: string): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      'SELECT * FROM appointments WHERE scheduled_date = ? AND status != ? ORDER BY queue_position ASC, created_at ASC',
      [date, 'cancelado']
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos:', error);
    return [];
  }
}

// ✅ Buscar agendamentos do usuário
export function getUserAppointments(userId: number): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      'SELECT * FROM appointments WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos do usuário:', error);
    return [];
  }
}


// ✅ Funções específicas para cada ação
export function startAttendingAppointment(appointmentId: number): boolean {
  try {
    const result = database.runSync(`
      UPDATE appointments 
      SET status = 'em_atendimento', 
          updated_at = datetime("now"), 
          attended_at = datetime("now") 
      WHERE id = ?
    `, [appointmentId]);
    
    return result.changes > 0;
  } catch (error) {
    console.error('❌ Erro ao iniciar atendimento:', error);
    return false;
  }
}

export function completeAppointment(appointmentId: number): boolean {
  try {
    const result = database.runSync(`
      UPDATE appointments 
      SET status = 'concluido', 
          updated_at = datetime("now") 
      WHERE id = ?
    `, [appointmentId]);
    
    return result.changes > 0;
  } catch (error) {
    console.error('❌ Erro ao concluir atendimento:', error);
    return false;
  }
}

export function cancelAppointmentById(appointmentId: number): boolean {
  try {
    const result = database.runSync(`
      UPDATE appointments 
      SET status = 'cancelado', 
          updated_at = datetime("now") 
      WHERE id = ?
    `, [appointmentId]);
    
    return result.changes > 0;
  } catch (error) {
    console.error('❌ Erro ao cancelar agendamento:', error);
    return false;
  }
}

// ✅ Função genérica mais simples
export function updateAppointmentStatus(
  appointmentId: number,
  status: 'agendado' | 'em_atendimento' | 'concluido' | 'cancelado'
): boolean {
  switch (status) {
    case 'em_atendimento':
      return startAttendingAppointment(appointmentId);
    case 'concluido':
      return completeAppointment(appointmentId);
    case 'cancelado':
      return cancelAppointmentById(appointmentId);
    default:
      try {
        const result = database.runSync(`
          UPDATE appointments 
          SET status = ?, updated_at = datetime("now") 
          WHERE id = ?
        `, [status, appointmentId]);
        
        return result.changes > 0;
      } catch (error) {
        console.error('❌ Erro ao atualizar status:', error);
        return false;
      }
  }
}
    
   

// ✅ Reordenar fila após cancelamento
function reorderQueue(date: string): void {
  try {
    const appointments = database.getAllSync<Appointment>(
      'SELECT id FROM appointments WHERE scheduled_date = ? AND status != ? ORDER BY queue_position ASC, created_at ASC',
      [date, 'cancelado']
    );
    
    appointments?.forEach((appointment, index) => {
      database.runSync(
        'UPDATE appointments SET queue_position = ? WHERE id = ?',
        [index + 1, appointment.id]
      );
    });
    
    console.log('✅ Fila reordenada para', date);
  } catch (error) {
    console.error('❌ Erro ao reordenar fila:', error);
  }
}

// ✅ Estatísticas de agendamentos
export function getAppointmentStats(): {
  total: number;
  agendados: number;
  em_atendimento: number;
  concluidos: number;
  hoje: number;
} {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const total = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE status != ?',
      ['cancelado']
    )?.count || 0;
    
    const agendados = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE status = ?',
      ['agendado']
    )?.count || 0;
    
    const em_atendimento = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE status = ?',
      ['em_atendimento']
    )?.count || 0;
    
    const concluidos = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE status = ?',
      ['concluido']
    )?.count || 0;
    
    const hoje = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status != ?',
      [today, 'cancelado']
    )?.count || 0;
    
    return { total, agendados, em_atendimento, concluidos, hoje };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    return { total: 0, agendados: 0, em_atendimento: 0, concluidos: 0, hoje: 0 };
  }
}

// ✅ Próximo da fila
export function getNextInQueue(date?: string): Appointment | null {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const next = database.getFirstSync<Appointment>(
      'SELECT * FROM appointments WHERE scheduled_date = ? AND status = ? ORDER BY queue_position ASC LIMIT 1',
      [targetDate, 'agendado']
    );
    
    return next || null;
  } catch (error) {
    console.error('❌ Erro ao buscar próximo da fila:', error);
    return null;
  }
}


// database/services/appointmentServices.ts - adicionar estas funções

// ✅ Buscar todos os agendamentos
export function getAllAppointments(): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      'SELECT * FROM appointments WHERE status != ? ORDER BY created_at DESC',
      ['cancelado']
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar todos os agendamentos:', error);
    return [];
  }
}

// ✅ Buscar agendamentos por status
export function getAppointmentsByStatus(status: 'agendado' | 'em_atendimento' | 'concluido'): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      'SELECT * FROM appointments WHERE status = ? ORDER BY queue_position ASC, created_at ASC',
      [status]
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos por status:', error);
    return [];
  }
}

// ✅ Buscar agendamentos ativos (agendados + em atendimento)
export function getActiveAppointments(): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      'SELECT * FROM appointments WHERE status IN (?, ?) ORDER BY scheduled_date ASC, queue_position ASC',
      ['agendado', 'em_atendimento']
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos ativos:', error);
    return [];
  }
}