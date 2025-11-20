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



// ✅ MODIFICAR: createAppointment para usar horário na posição
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
    // ✅ NOVO: Calcular posição baseada no horário
    const queuePosition = getNextQueuePosition(scheduledDate, scheduledTime);
    
    const result = database.runSync(`
      INSERT INTO appointments (
        user_id, user_name, user_email, service_type, description,
        scheduled_date, scheduled_time, queue_position, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [
      userId, userName, userEmail, serviceType, description,
      scheduledDate, scheduledTime, queuePosition
    ]);
    
    console.log(`✅ Agendamento criado - ID: ${result.lastInsertRowId}, Posição: ${queuePosition}, Horário: ${scheduledTime}`);
    
    // ✅ NOVO: Reorganizar todas as posições após inserir
    reorganizeQueueByTime(scheduledDate);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error);
    throw error;
  }
}




// ✅ NOVA: Reorganizar fila sempre por horário
export function reorganizeQueueByTime(date: string): void {
  try {
    console.log('🔄 Reorganizando fila por horário para:', date);
    
    // Buscar todos os agendamentos ativos ordenados por horário
    const appointments = database.getAllSync<{ id: number; scheduled_time: string; status: string }>(
      `SELECT id, scheduled_time, status
       FROM appointments 
       WHERE scheduled_date = ? 
       AND status IN ('agendado', 'em_atendimento')
       ORDER BY 
         CASE 
           WHEN status = 'em_atendimento' THEN 1
           WHEN status = 'agendado' THEN 2
         END,
         scheduled_time ASC`,
      [date]
    );
    
    if (!appointments || appointments.length === 0) {
      console.log('ℹ️ Nenhum agendamento ativo para reorganizar');
      return;
    }
    
    // Atualizar posições sequencialmente baseado no horário
    appointments.forEach((appointment, index) => {
      const newPosition = index + 1;
      
      database.runSync(
        'UPDATE appointments SET queue_position = ?, updated_at = datetime("now") WHERE id = ?',
        [newPosition, appointment.id]
      );
    });
    
    console.log(`✅ Fila reorganizada por horário - ${appointments.length} agendamentos`);
    
    // ✅ Log da nova ordem
    appointments.forEach((apt, index) => {
      console.log(`${index + 1}. Horário: ${apt.scheduled_time} - Status: ${apt.status}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao reorganizar fila:', error);
  }
}



// ✅ ATUALIZAR: Calcular posição baseada no horário
function getNextQueuePosition(date: string, scheduledTime: string): number {
  try {
    console.log('🔍 Calculando posição na fila para:', date, 'às', scheduledTime);
    
    // Contar quantos agendamentos ativos existem ANTES do horário escolhido
    const result = database.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count 
       FROM appointments 
       WHERE scheduled_date = ? 
       AND status IN ('agendado', 'em_atendimento')
       AND scheduled_time <= ?`, // ✅ NOVO: Só conta os anteriores ao horário
      [date, scheduledTime]
    );
    
    const position = (result?.count || 0) + 1;
    console.log('📊 Posição calculada baseada no horário:', position);
    
    return position;
  } catch (error) {
    console.error('❌ Erro ao calcular posição na fila:', error);
    return 1;
  }
}


// ✅ NOVA: Reorganizar automaticamente após cada mudança
function autoReorganizePositions(date: string): void {
  try {
    console.log('🔄 Auto-reorganizando posições para:', date);
    
    // Buscar agendamentos ativos ordenados logicamente
    const activeAppointments = database.getAllSync<{ id: number; status: string; queue_position: number }>(
      `SELECT id, status, queue_position
       FROM appointments 
       WHERE scheduled_date = ? 
       AND status IN ('agendado', 'em_atendimento')
       ORDER BY 
         CASE 
           WHEN status = 'em_atendimento' THEN 1
           WHEN status = 'agendado' THEN 2
         END,
         queue_position ASC,
         created_at ASC`,
      [date]
    );
    
    if (!activeAppointments || activeAppointments.length === 0) {
      console.log('ℹ️ Nenhum agendamento ativo para reorganizar');
      return;
    }
    
    // Atualizar posições sequencialmente
    activeAppointments.forEach((appointment, index) => {
      const newPosition = index + 1;
      
      // Só atualizar se a posição mudou
      if (appointment.queue_position !== newPosition) {
        database.runSync(
          'UPDATE appointments SET queue_position = ?, updated_at = datetime("now") WHERE id = ?',
          [newPosition, appointment.id]
        );
        console.log(`📝 Agendamento ${appointment.id}: posição ${appointment.queue_position} → ${newPosition}`);
      }
    });
    
    console.log(`✅ Reorganização concluída - ${activeAppointments.length} agendamentos`);
  } catch (error) {
    console.error('❌ Erro na reorganização automática:', error);
  }
}




// ✅ SOLUÇÃO COMPLETA: Ordenação inteligente
export function getAppointmentsByDate(date: string): Appointment[] {
  try {
    console.log('🔍 Buscando agendamentos ordenados por horário para:', date);
    
    const appointments = database.getAllSync<Appointment>(
      `SELECT * FROM appointments 
       WHERE scheduled_date = ? AND status != ? 
       ORDER BY 
         CASE 
           WHEN status = 'em_atendimento' THEN 1
           WHEN status = 'agendado' THEN 2
           ELSE 3
         END,
         scheduled_time ASC,
         created_at ASC`, // ✅ Prioridade: 1°Status, 2°Horário, 3°Criação
      [date, 'cancelado']
    );
    
    console.log(`📋 Fila ordenada: ${appointments?.length || 0} agendamentos`);
    
    // ✅ BONUS: Log da ordem para debug
    appointments?.forEach((apt, index) => {
      console.log(`${index + 1}. ${apt.user_name} - ${apt.scheduled_time} (${apt.status})`);
    });
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos:', error);
    return [];
  }
}




// ✅ Buscar agendamentos do usuário
// ✅ IMPLEMENTAÇÃO FINAL RECOMENDADA:
export function getUserAppointments(userId: number): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      `SELECT * FROM appointments 
       WHERE user_id = ? 
       AND status IN ('agendado', 'em_atendimento')
       ORDER BY 
         CASE WHEN status = 'em_atendimento' THEN 1 ELSE 2 END,
         scheduled_date ASC, 
         queue_position ASC`,
      [userId]
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos do usuário:', error);
    return [];
  }
}



// ✅ EXEMPLO: startAttendingAppointment
export function startAttendingAppointment(appointmentId: number): boolean {
  try {
    const appointment = database.getFirstSync<{ scheduled_date: string }>(
      'SELECT scheduled_date FROM appointments WHERE id = ?',
      [appointmentId]
    );
    
    if (!appointment) return false;
    
    const result = database.runSync(`
      UPDATE appointments 
      SET status = 'em_atendimento', 
          updated_at = datetime("now"), 
          attended_at = datetime("now") 
      WHERE id = ?
    `, [appointmentId]);
    
    const success = result.changes > 0;
    
    if (success) {
      console.log('✅ Status alterado para em_atendimento');
      // ✅ NOVO: Reorganizar por horário
      reorganizeQueueByTime(appointment.scheduled_date);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao iniciar atendimento:', error);
    return false;
  }
}



export function completeAppointment(appointmentId: number): boolean {
  try {
    console.log('🎯 Concluindo atendimento:', appointmentId);
    
    const appointment = database.getFirstSync<{ scheduled_date: string; status: string }>(
      'SELECT scheduled_date, status FROM appointments WHERE id = ?',
      [appointmentId]
    );
    
    if (!appointment) {
      console.error('❌ Agendamento não encontrado');
      return false;
    }
    
    const result = database.runSync(`
      UPDATE appointments 
      SET status = 'concluido', 
          updated_at = datetime("now"),
          queue_position = 0
      WHERE id = ?
    `, [appointmentId]);
    
    const success = result.changes > 0;
    
    if (success) {
      console.log('✅ Agendamento concluído');
      // ✅ NOVO: Reorganizar fila após conclusão
      autoReorganizePositions(appointment.scheduled_date);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao concluir atendimento:', error);
    return false;
  }
}

export function cancelAppointmentById(appointmentId: number): boolean {
  try {
    console.log('❌ Cancelando agendamento:', appointmentId);
    
    const appointment = database.getFirstSync<{ scheduled_date: string }>(
      'SELECT scheduled_date FROM appointments WHERE id = ?',
      [appointmentId]
    );
    
    if (!appointment) {
      console.error('❌ Agendamento não encontrado');
      return false;
    }
    
    const result = database.runSync(`
      UPDATE appointments 
      SET status = 'cancelado', 
          updated_at = datetime("now"),
          queue_position = 0
      WHERE id = ?
    `, [appointmentId]);
    
    const success = result.changes > 0;
    
    if (success) {
      console.log('✅ Agendamento cancelado');
      // ✅ NOVO: Reorganizar fila após cancelamento
      autoReorganizePositions(appointment.scheduled_date);
    }
    
    return success;
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
   


// ✅ CORRIGIR: getAppointmentStats - contar agendamentos para hoje
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
    
    // ✅ CORRIGIDO: Contar agendamentos AGENDADOS PARA hoje (não criados hoje)
    const hoje = database.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE scheduled_date = ? 
       AND status IN ('agendado', 'em_atendimento')`, // ✅ Só os ativos para hoje
      [today]
    )?.count || 0;
    
    console.log(`📊 Stats - Total: ${total}, Hoje: ${hoje}, Agendados: ${agendados}`);
    
    return { total, agendados, em_atendimento, concluidos, hoje };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    return { total: 0, agendados: 0, em_atendimento: 0, concluidos: 0, hoje: 0 };
  }
}





// ✅ NOVA: Agendamentos de hoje (para relatório detalhado)
export function getTodayAppointments(): Appointment[] {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const appointments = database.getAllSync<Appointment>(
      `SELECT * FROM appointments 
       WHERE scheduled_date = ? 
       AND status IN ('agendado', 'em_atendimento') 
       ORDER BY queue_position ASC, scheduled_time ASC`,
      [today]
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos de hoje:', error);
    return [];
  }
}

// ✅ NOVA: Histórico de agendamentos (concluídos e cancelados)
export function getAppointmentsHistory(limit: number = 50): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      `SELECT * FROM appointments 
       WHERE status IN ('concluido', 'cancelado') 
       ORDER BY updated_at DESC, created_at DESC 
       LIMIT ?`,
      [limit]
    );
    
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    return [];
  }
}

// ✅ NOVA: Estatísticas detalhadas por período
export function getDetailedStats(): {
  hoje: {
    total: number;
    agendados: number;
    em_atendimento: number;
    concluidos: number;
  };
  esta_semana: {
    total: number;
    concluidos: number;
  };
  este_mes: {
    total: number;
    concluidos: number;
  };
} {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Uma semana atrás
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    // Um mês atrás
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];
    
    // Hoje
    const hojeTotal = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status != ?',
      [today, 'cancelado']
    )?.count || 0;
    
    const hojeAgendados = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status = ?',
      [today, 'agendado']
    )?.count || 0;
    
    const hojeEmAtendimento = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status = ?',
      [today, 'em_atendimento']
    )?.count || 0;
    
    const hojeConcluidos = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status = ?',
      [today, 'concluido']
    )?.count || 0;
    
    // Esta semana
    const semanaTotal = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status != ?',
      [weekAgoStr, 'cancelado']
    )?.count || 0;
    
    const semanaConcluidos = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status = ?',
      [weekAgoStr, 'concluido']
    )?.count || 0;
    
    // Este mês
    const mesTotal = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status != ?',
      [monthAgoStr, 'cancelado']
    )?.count || 0;
    
    const mesConcluidos = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status = ?',
      [monthAgoStr, 'concluido']
    )?.count || 0;
    
    return {
      hoje: {
        total: hojeTotal,
        agendados: hojeAgendados,
        em_atendimento: hojeEmAtendimento,
        concluidos: hojeConcluidos
      },
      esta_semana: {
        total: semanaTotal,
        concluidos: semanaConcluidos
      },
      este_mes: {
        total: mesTotal,
        concluidos: mesConcluidos
      }
    };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas detalhadas:', error);
    return {
      hoje: { total: 0, agendados: 0, em_atendimento: 0, concluidos: 0 },
      esta_semana: { total: 0, concluidos: 0 },
      este_mes: { total: 0, concluidos: 0 }
    };
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