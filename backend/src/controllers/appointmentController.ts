import { Request, Response } from 'express';
import { pool } from '../config/database';

// ── Reorganizar fila por serviço e horário ────────────────────────────────────
async function reorganizeQueue(date: string, serviceId: number): Promise<void> {
  const [rows] = await pool.query(
    `SELECT id FROM appointments
     WHERE scheduled_date = ?
       AND service_id = ?
       AND status IN ('agendado','em_atendimento')
     ORDER BY
       CASE WHEN status = 'em_atendimento' THEN 1 ELSE 2 END,
       scheduled_time ASC`,
    [date, serviceId]
  ) as any[];

  for (let i = 0; i < (rows as any[]).length; i++) {
    await pool.query(
      'UPDATE appointments SET queue_position = ? WHERE id = ?',
      [i + 1, (rows as any[])[i].id]
    );
  }
}

// ── Buscar fila do dia (agrupada por serviço) ─────────────────────────────────
export async function getByDate(req: Request, res: Response): Promise<void> {
  const { date } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT
         a.*,
         s.name        as service_name,
         s.duration_min,
         p.name        as professional_name,
         -- ✅ posição calculada dentro do próprio serviço
         (
           SELECT COUNT(*)
           FROM appointments a2
           WHERE a2.scheduled_date = a.scheduled_date
             AND a2.service_id     = a.service_id
             AND a2.status IN ('agendado','em_atendimento')
             AND (
               a2.scheduled_time < a.scheduled_time
               OR (
                 a2.scheduled_time = a.scheduled_time
                 AND a2.id <= a.id
               )
             )
         ) as queue_position
       FROM appointments a
       LEFT JOIN services      s ON s.id = a.service_id
       LEFT JOIN professionals p ON p.id = a.professional_id
       WHERE a.scheduled_date = ?
         AND a.status != 'cancelado'
       ORDER BY
         s.name ASC,
         CASE
           WHEN a.status = 'em_atendimento' THEN 1
           WHEN a.status = 'agendado'       THEN 2
           ELSE 3
         END,
         a.scheduled_time ASC`,
      [date]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar fila:', error);
    res.status(500).json({ error: 'Erro ao buscar fila' });
  }
}

// ── Agendamentos do usuário logado ────────────────────────────────────────────
export async function getUserAppointments(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user!.id;
  try {
    const [rows] = await pool.query(
      `SELECT
         a.*,
         s.name         as service_name,
         s.duration_min,
         p.name         as professional_name,
         -- ✅ posição dentro do serviço do usuário
         (
           SELECT COUNT(*)
           FROM appointments a2
           WHERE a2.scheduled_date = a.scheduled_date
             AND a2.service_id     = a.service_id
             AND a2.status IN ('agendado','em_atendimento')
             AND (
               a2.scheduled_time < a.scheduled_time
               OR (
                 a2.scheduled_time = a.scheduled_time
                 AND a2.id <= a.id
               )
             )
         ) as queue_position
       FROM appointments a
       LEFT JOIN services      s ON s.id = a.service_id
       LEFT JOIN professionals p ON p.id = a.professional_id
       WHERE a.user_id = ?
         AND a.status IN ('agendado','em_atendimento')
       ORDER BY
         a.scheduled_date ASC,
         a.scheduled_time ASC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// ── Criar agendamento ─────────────────────────────────────────────────────────
  export async function create(req: Request, res: Response): Promise<void> {
    const {
      service_id,
      professional_id,
      description,
      scheduled_date,
      scheduled_time,
    } = req.body;

    const user = req.user!;

    if (!service_id || !scheduled_date || !scheduled_time) {
      res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      return;
    }

    // ✅ não permitir horários no passado ou menos de 10 min no futuro
    const now = new Date();
    const appointmentDateTime = new Date(`${scheduled_date}T${scheduled_time}`);
    const diffMinutes = (appointmentDateTime.getTime() - now.getTime()) / 60000;

    if (diffMinutes < 10) {
      res.status(400).json({
        error: 'O agendamento deve ser feito com pelo menos 10 minutos de antecedência.',
      });
      return;
    }

    try {
      // ✅ verificar conflito de horário considerando duração da consulta
      const [conflictRows] = await pool.query(
        `SELECT a.id
        FROM appointments a
        INNER JOIN services s ON s.id = a.service_id
        WHERE a.service_id = ?
          AND a.scheduled_date = ?
          AND a.status IN ('agendado', 'em_atendimento')
          AND (
            (? >= a.scheduled_time
              AND ? < ADDTIME(a.scheduled_time, SEC_TO_TIME(s.duration_min * 60)))
            OR
            (a.scheduled_time >= ?
              AND a.scheduled_time < ADDTIME(?, SEC_TO_TIME(
                (SELECT duration_min FROM services WHERE id = ?) * 60
              )))
          )`,
        [
          service_id,
          scheduled_date,
          scheduled_time, scheduled_time,
          scheduled_time, scheduled_time, service_id,
        ]
      ) as any[];

      if ((conflictRows as any[]).length > 0) {
        res.status(409).json({
          error: 'Já existe um agendamento neste horário para este serviço. Escolha outro horário.',
        });
        return;
      }

      // ✅ posição calculada dentro do serviço específico
      const [countRows] = await pool.query(
        `SELECT COUNT(*) as count
        FROM appointments
        WHERE scheduled_date = ?
          AND service_id = ?
          AND status IN ('agendado','em_atendimento')
          AND scheduled_time <= ?`,
        [scheduled_date, service_id, scheduled_time]
      ) as any[];

      const position = (countRows as any[])[0].count + 1;

      // buscar dados do usuário
      const [userRows] = await pool.query(
        'SELECT name, email FROM users WHERE id = ?',
        [user.id]
      ) as any[];

      const userData = (userRows as any[])[0];

      if (!userData) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const [result] = await pool.query(
        `INSERT INTO appointments
          (user_id, user_name, user_email, service_id, professional_id,
            description, scheduled_date, scheduled_time, queue_position)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          userData.name,
          userData.email,
          service_id,
          professional_id || null,
          description || '',
          scheduled_date,
          scheduled_time,
          position,
        ]
      ) as any[];

      // ✅ reorganizar apenas a fila do serviço agendado
      await reorganizeQueue(scheduled_date, service_id);

      console.log(`✅ Agendamento criado — ID: ${(result as any).insertId}, Serviço: ${service_id}, Posição: ${position}`);

      res.status(201).json({
        id:             (result as any).insertId,
        queue_position: position,
      });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }


// ── Atualizar status ──────────────────────────────────────────────────────────
  export async function updateStatus(req: Request, res: Response): Promise<void> {
    const { id }     = req.params;
    const { status } = req.body;
    const user       = req.user!;

    const validStatus = ['agendado', 'em_atendimento', 'concluido', 'cancelado'];
    if (!validStatus.includes(status)) {
      res.status(400).json({ error: 'Status inválido' });
      return;
    }

    try {
      // ✅ buscar user_id também para verificar permissão
      const [rows] = await pool.query(
        'SELECT scheduled_date, service_id, user_id FROM appointments WHERE id = ?',
        [id]
      ) as any[];

      const appt = (rows as any[])[0];
      if (!appt) {
        res.status(404).json({ error: 'Agendamento não encontrado' });
        return;
      }

      // ✅ usuário comum só pode cancelar o próprio agendamento
      if (user.role !== 'admin') {
        if (appt.user_id !== user.id) {
          res.status(403).json({ error: 'Sem permissão para alterar este agendamento' });
          return;
        }
        if (status !== 'cancelado') {
          res.status(403).json({ error: 'Usuário só pode cancelar agendamentos' });
          return;
        }
      }

      // montar SET dinâmico
      let setClause = 'status = ?';
      const params: any[] = [status];

      if (status === 'em_atendimento') {
        setClause += ', attended_at = NOW()';
      } else if (status === 'concluido' || status === 'cancelado') {
        setClause += ', queue_position = 0';
      }

      params.push(id);

      await pool.query(
        `UPDATE appointments SET ${setClause} WHERE id = ?`,
        params
      );

      // ✅ reorganizar apenas a fila do serviço afetado
      await reorganizeQueue(appt.scheduled_date, appt.service_id);

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }

// ── Estatísticas gerais ───────────────────────────────────────────────────────
export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [[{ total }]]          = await pool.query(
      "SELECT COUNT(*) as total FROM appointments WHERE status != 'cancelado'"
    ) as any[];

    const [[{ agendados }]]      = await pool.query(
      "SELECT COUNT(*) as agendados FROM appointments WHERE status = 'agendado'"
    ) as any[];

    const [[{ em_atendimento }]] = await pool.query(
      "SELECT COUNT(*) as em_atendimento FROM appointments WHERE status = 'em_atendimento'"
    ) as any[];

    const [[{ concluidos }]]     = await pool.query(
      "SELECT COUNT(*) as concluidos FROM appointments WHERE status = 'concluido'"
    ) as any[];

    const [[{ hoje }]]           = await pool.query(
      `SELECT COUNT(*) as hoje FROM appointments
       WHERE scheduled_date = ?
         AND status IN ('agendado','em_atendimento')`,
      [today]
    ) as any[];

    res.json({ total, agendados, em_atendimento, concluidos, hoje });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// ── Histórico (concluídos e cancelados) ───────────────────────────────────────
export async function getHistory(req: Request, res: Response): Promise<void> {
  const limit = Number(req.query.limit) || 100;
  try {
    const [rows] = await pool.query(
      `SELECT
         a.*,
         s.name as service_name,
         p.name as professional_name
       FROM appointments a
       LEFT JOIN services      s ON s.id = a.service_id
       LEFT JOIN professionals p ON p.id = a.professional_id
       WHERE a.status IN ('concluido','cancelado')
       ORDER BY a.updated_at DESC
       LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}


// ── Auto-iniciar agendamentos no horário ──────────────────────────────────────
export async function autoStartAppointments(): Promise<void> {
  try {
    const now     = new Date();
    const date    = getLocalDateString(now);
    const time    = now.toTimeString().split(' ')[0]; // HH:MM:SS

    // busca agendados cujo horário já chegou
    const [rows] = await pool.query(
      `SELECT id, service_id, scheduled_date
       FROM appointments
       WHERE status = 'agendado'
         AND scheduled_date = ?
         AND scheduled_time <= ?`,
      [date, time]
    ) as any[];

    for (const appt of rows as any[]) {
      await pool.query(
        `UPDATE appointments
         SET status = 'em_atendimento', attended_at = NOW()
         WHERE id = ?`,
        [appt.id]
      );
      await reorganizeQueue(appt.scheduled_date, appt.service_id);
      console.log(`⏰ Auto-iniciado: agendamento #${appt.id}`);
    }
  } catch (error) {
    console.error('Erro no auto-start:', error);
  }
}

// ── Auto-concluir agendamentos após duração da consulta ───────────────────────
export async function autoFinishAppointments(): Promise<void> {
  try {
    const now  = new Date();
    const date = getLocalDateString(now);
    const time = now.toTimeString().split(' ')[0];

    // em_atendimento cujo horário + duração já passou
    const [rows] = await pool.query(
      `SELECT a.id, a.service_id, a.scheduled_date
       FROM appointments a
       INNER JOIN services s ON s.id = a.service_id
       WHERE a.status = 'em_atendimento'
         AND a.scheduled_date = ?
         AND ADDTIME(a.scheduled_time, SEC_TO_TIME(s.duration_min * 60)) <= ?`,
      [date, time]
    ) as any[];

    for (const appt of rows as any[]) {
      await pool.query(
        `UPDATE appointments
         SET status = 'concluido', queue_position = 0
         WHERE id = ?`,
        [appt.id]
      );
      await reorganizeQueue(appt.scheduled_date, appt.service_id);
      console.log(`✅ Auto-concluído: agendamento #${appt.id}`);
    }
  } catch (error) {
    console.error('Erro no auto-finish:', error);
  }
}

// helper local
function getLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}