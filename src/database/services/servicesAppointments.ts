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

export const SERVICE_TYPES = [
  { value: 'corte_geral', label: 'Corte' },
  { value: 'barba_tecnico', label: 'Barba' },
  { value: 'pintar_cabelo', label: 'Pintar' },
  { value: 'sobrancelha', label: 'Fazer Sobrancelhas' },
  { value: 'outros', label: 'Outros' },
];


  // ── Helper local no topo do arquivo ───────────────────────────────────────
  function getLocalDate(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

// ── Substituir todas as ocorrências de: ───────────────────────────────────
// const today = new Date().toISOString().split('T')[0];
// por:
// const today = getLocalDate();

// ✅ Única função de reorganização — ordena sempre por horário
export function reorganizeQueueByTime(date: string): void {
  try {
    console.log('🔄 Reorganizando fila por horário para:', date);

    const appointments = database.getAllSync<{ id: number; scheduled_time: string; status: string }>(
      `SELECT id, scheduled_time, status
       FROM appointments
       WHERE scheduled_date = ?
         AND status IN ('agendado', 'em_atendimento')
       ORDER BY
         CASE WHEN status = 'em_atendimento' THEN 1 ELSE 2 END,
         scheduled_time ASC`,
      [date]
    );

    if (!appointments || appointments.length === 0) {
      console.log('ℹ️ Nenhum agendamento ativo para reorganizar');
      return;
    }

    appointments.forEach((appointment, index) => {
      database.runSync(
        'UPDATE appointments SET queue_position = ?, updated_at = datetime("now") WHERE id = ?',
        [index + 1, appointment.id]
      );
    });

    console.log(`✅ Fila reorganizada — ${appointments.length} agendamentos`);
    appointments.forEach((apt, index) => {
      console.log(`  ${index + 1}. ${apt.scheduled_time} (${apt.status})`);
    });
  } catch (error) {
    console.error('❌ Erro ao reorganizar fila:', error);
  }
}

function getNextQueuePosition(date: string, scheduledTime: string): number {
  try {
    const result = database.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM appointments
       WHERE scheduled_date = ?
         AND status IN ('agendado', 'em_atendimento')
         AND scheduled_time <= ?`,
      [date, scheduledTime]
    );
    const position = (result?.count || 0) + 1;
    console.log('📊 Posição calculada:', position);
    return position;
  } catch (error) {
    console.error('❌ Erro ao calcular posição:', error);
    return 1;
  }
}

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
    const queuePosition = getNextQueuePosition(scheduledDate, scheduledTime);

    const result = database.runSync(
      `INSERT INTO appointments (
        user_id, user_name, user_email, service_type, description,
        scheduled_date, scheduled_time, queue_position, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [userId, userName, userEmail, serviceType, description, scheduledDate, scheduledTime, queuePosition]
    );

    console.log(`✅ Agendamento criado — ID: ${result.lastInsertRowId}, Posição: ${queuePosition}`);

    reorganizeQueueByTime(scheduledDate);

    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error);
    throw error;
  }
}

export function getAppointmentsByDate(date: string): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      `SELECT * FROM appointments
       WHERE scheduled_date = ? AND status != 'cancelado'
       ORDER BY
         CASE
           WHEN status = 'em_atendimento' THEN 1
           WHEN status = 'agendado' THEN 2
           ELSE 3
         END,
         scheduled_time ASC,
         created_at ASC`,
      [date]
    );
    console.log(`📋 ${appointments?.length || 0} agendamentos para ${date}`);
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos:', error);
    return [];
  }
}

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

export function startAttendingAppointment(appointmentId: number): boolean {
  try {
    const appointment = database.getFirstSync<{ scheduled_date: string }>(
      'SELECT scheduled_date FROM appointments WHERE id = ?',
      [appointmentId]
    );
    if (!appointment) return false;

    const result = database.runSync(
      `UPDATE appointments
       SET status = 'em_atendimento', updated_at = datetime('now'), attended_at = datetime('now')
       WHERE id = ?`,
      [appointmentId]
    );

    const success = result.changes > 0;
    if (success) {
      console.log('✅ Status → em_atendimento');
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
    const appointment = database.getFirstSync<{ scheduled_date: string }>(
      'SELECT scheduled_date FROM appointments WHERE id = ?',
      [appointmentId]
    );
    if (!appointment) return false;

    const result = database.runSync(
      `UPDATE appointments
       SET status = 'concluido', updated_at = datetime('now'), queue_position = 0
       WHERE id = ?`,
      [appointmentId]
    );

    const success = result.changes > 0;
    if (success) {
      console.log('✅ Agendamento concluído');
      // ✅ CORRIGIDO: usa a mesma função de reorganização
      reorganizeQueueByTime(appointment.scheduled_date);
    }
    return success;
  } catch (error) {
    console.error('❌ Erro ao concluir atendimento:', error);
    return false;
  }
}

export function cancelAppointmentById(appointmentId: number): boolean {
  try {
    const appointment = database.getFirstSync<{ scheduled_date: string }>(
      'SELECT scheduled_date FROM appointments WHERE id = ?',
      [appointmentId]
    );
    if (!appointment) return false;

    const result = database.runSync(
      `UPDATE appointments
       SET status = 'cancelado', updated_at = datetime('now'), queue_position = 0
       WHERE id = ?`,
      [appointmentId]
    );

    const success = result.changes > 0;
    if (success) {
      console.log('✅ Agendamento cancelado');
      // ✅ CORRIGIDO: usa a mesma função de reorganização
      reorganizeQueueByTime(appointment.scheduled_date);
    }
    return success;
  } catch (error) {
    console.error('❌ Erro ao cancelar agendamento:', error);
    return false;
  }
}

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
        const result = database.runSync(
          `UPDATE appointments SET status = ?, updated_at = datetime('now') WHERE id = ?`,
          [status, appointmentId]
        );
        return result.changes > 0;
      } catch (error) {
        console.error('❌ Erro ao atualizar status:', error);
        return false;
      }
  }
}

export function getAppointmentStats(): {
  total: number;
  agendados: number;
  em_atendimento: number;
  concluidos: number;
  hoje: number;
} {
  try {
    const today = getLocalDate();

    const total = database.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM appointments WHERE status != 'cancelado'"
    )?.count || 0;

    const agendados = database.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM appointments WHERE status = 'agendado'"
    )?.count || 0;

    const em_atendimento = database.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM appointments WHERE status = 'em_atendimento'"
    )?.count || 0;

    const concluidos = database.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM appointments WHERE status = 'concluido'"
    )?.count || 0;

    const hoje = database.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM appointments
       WHERE scheduled_date = ?
         AND status IN ('agendado', 'em_atendimento')`,
      [today]
    )?.count || 0;

    return { total, agendados, em_atendimento, concluidos, hoje };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    return { total: 0, agendados: 0, em_atendimento: 0, concluidos: 0, hoje: 0 };
  }
}

export function getTodayAppointments(): Appointment[] {
  try {
    const today = getLocalDate();
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

export function getDetailedStats(): {
  hoje: { total: number; agendados: number; em_atendimento: number; concluidos: number };
  esta_semana: { total: number; concluidos: number };
  este_mes: { total: number; concluidos: number };
} {
  try {
    const today = getLocalDate();

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];

    const q = (sql: string, params: any[]) =>
      database.getFirstSync<{ count: number }>(sql, params)?.count || 0;

    return {
      hoje: {
        total: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status != 'cancelado'", [today]),
        agendados: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status = 'agendado'", [today]),
        em_atendimento: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status = 'em_atendimento'", [today]),
        concluidos: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date = ? AND status = 'concluido'", [today]),
      },
      esta_semana: {
        total: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status != 'cancelado'", [weekAgoStr]),
        concluidos: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status = 'concluido'", [weekAgoStr]),
      },
      este_mes: {
        total: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status != 'cancelado'", [monthAgoStr]),
        concluidos: q("SELECT COUNT(*) as count FROM appointments WHERE scheduled_date >= ? AND status = 'concluido'", [monthAgoStr]),
      },
    };
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas detalhadas:', error);
    return {
      hoje: { total: 0, agendados: 0, em_atendimento: 0, concluidos: 0 },
      esta_semana: { total: 0, concluidos: 0 },
      este_mes: { total: 0, concluidos: 0 },
    };
  }
}

export function getNextInQueue(date?: string): Appointment | null {
  try {
    const targetDate = date || getLocalDate();
    const next = database.getFirstSync<Appointment>(
      "SELECT * FROM appointments WHERE scheduled_date = ? AND status = 'agendado' ORDER BY queue_position ASC LIMIT 1",
      [targetDate]
    );
    return next || null;
  } catch (error) {
    console.error('❌ Erro ao buscar próximo da fila:', error);
    return null;
  }
}

export function getAllAppointments(): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      "SELECT * FROM appointments WHERE status != 'cancelado' ORDER BY created_at DESC"
    );
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar todos os agendamentos:', error);
    return [];
  }
}

export function getAppointmentsByStatus(
  status: 'agendado' | 'em_atendimento' | 'concluido'
): Appointment[] {
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

export function getActiveAppointments(): Appointment[] {
  try {
    const appointments = database.getAllSync<Appointment>(
      "SELECT * FROM appointments WHERE status IN ('agendado', 'em_atendimento') ORDER BY scheduled_date ASC, queue_position ASC"
    );
    return appointments || [];
  } catch (error) {
    console.error('❌ Erro ao buscar agendamentos ativos:', error);
    return [];
  }
}