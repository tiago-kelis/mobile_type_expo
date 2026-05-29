import { Request, Response } from 'express';
import { pool } from '../config/database';

export async function getMyProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  try {
    const [rows] = await pool.query(
      `SELECT p.*, sp.name as specialty_name,
         GROUP_CONCAT(s.name SEPARATOR '||') as service_names
       FROM professionals p
       LEFT JOIN specialties sp ON sp.id = p.specialty_id
       LEFT JOIN professional_services ps ON ps.professional_id = p.id
       LEFT JOIN services s ON s.id = ps.service_id
       WHERE p.user_id = ?
       GROUP BY p.id`,
      [userId]
    ) as any[];

    const prof = (rows as any[])[0];
    if (!prof) {
      res.status(404).json({ error: 'Perfil profissional não encontrado' });
      return;
    }

    res.json({
      ...prof,
      specialty_name: prof.specialty_name ?? 'Sem especialidade',
      service_names: prof.service_names ? prof.service_names.split('||') : [],
    });
  } catch (error) {
    console.error('❌ getMyProfile:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getMyAppointments(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  try {
    const [prof] = await pool.query(
      'SELECT id FROM professionals WHERE user_id = ?', [userId]
    ) as any[];

    const professional = (prof as any[])[0];
    if (!professional) {
      res.json([]);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const [rows] = await pool.query(
      `SELECT a.*, s.name as service_name, u.name as user_name, u.email as user_email
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.professional_id = ?
         AND a.scheduled_date >= ?
         AND a.status IN ('agendado','em_atendimento')
       ORDER BY a.scheduled_date ASC, a.scheduled_time ASC`,
      [professional.id, today]
    ) as any[];

    res.json(rows);
  } catch (error) {
    console.error('❌ getMyAppointments:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getMySchedule(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  try {
    const [prof] = await pool.query(
      'SELECT id FROM professionals WHERE user_id = ?', [userId]
    ) as any[];

    const professional = (prof as any[])[0];
    if (!professional) { res.json([]); return; }

    const [rows] = await pool.query(
      `SELECT
         DATE(scheduled_date) as date,
         COUNT(*) as total,
         SUM(CASE WHEN status = 'agendado' THEN 1 ELSE 0 END) as agendados,
         SUM(CASE WHEN status = 'em_atendimento' THEN 1 ELSE 0 END) as em_atendimento,
         SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) as concluidos
       FROM appointments
       WHERE professional_id = ?
         AND scheduled_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(scheduled_date)
       ORDER BY DATE(scheduled_date) ASC`,
      [professional.id]
    ) as any[];

    res.json(rows);
  } catch (error) {
    console.error('❌ getMySchedule:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function toggleMyDuty(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  try {
    await pool.query(
      'UPDATE professionals SET on_duty = NOT on_duty WHERE user_id = ?',
      [userId]
    );
    const [rows] = await pool.query(
      'SELECT on_duty FROM professionals WHERE user_id = ?', [userId]
    ) as any[];
    res.json({ on_duty: (rows as any[])[0]?.on_duty });
  } catch (error) {
    console.error('❌ toggleMyDuty:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function updateMyProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { crm } = req.body;
  try {
    await pool.query(
      'UPDATE professionals SET crm = ? WHERE user_id = ?',
      [crm || null, userId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('❌ updateMyProfile:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getMyQueue(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  try {
    const [profRows] = await pool.query(
      'SELECT id, specialty_id FROM professionals WHERE user_id = ?',
      [userId]
    ) as any[];

    const prof = (profRows as any[])[0];
    if (!prof) { res.json([]); return; }

    const today = new Date().toISOString().split('T')[0];

    const [rows] = await pool.query(
      `SELECT
         a.*,
         s.name         as service_name,
         s.duration_min,
         p.name         as professional_name,
         p.id           as professional_id,
         u.name         as user_name,
         u.email        as user_email
       FROM appointments a
       LEFT JOIN services      s ON s.id = a.service_id
       LEFT JOIN professionals p ON p.id = a.professional_id
       LEFT JOIN users         u ON u.id = a.user_id
       WHERE a.scheduled_date = ?
         AND a.status IN ('agendado','em_atendimento')
         AND p.specialty_id = ?
       ORDER BY
         CASE WHEN a.status = 'em_atendimento' THEN 1 ELSE 2 END,
         a.scheduled_time ASC`,
      [today, prof.specialty_id]
    ) as any[];

    res.json(rows);
  } catch (error) {
    console.error('❌ getMyQueue:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function sendPrescription(
  req: Request, res: Response
): Promise<void> {
  const userId = req.user!.id;
  const { appointment_id, content } = req.body;

  if (!appointment_id || !content?.trim()) {
    res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    return;
  }

  try {
    const [profRows] = await pool.query(
      'SELECT id FROM professionals WHERE user_id = ?', [userId]
    ) as any[];
    const prof = (profRows as any[])[0];
    if (!prof) {
      res.status(404).json({ error: 'Profissional não encontrado' });
      return;
    }

    const [apptRows] = await pool.query(
      `SELECT a.*, u.name as patient_name, u.email as patient_email
       FROM appointments a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.id = ?`,
      [appointment_id]
    ) as any[];
    const appt = (apptRows as any[])[0];
    if (!appt) {
      res.status(404).json({ error: 'Agendamento não encontrado' });
      return;
    }

    await pool.query(
      `INSERT INTO prescriptions
         (appointment_id, professional_id, patient_name, patient_email, content)
       VALUES (?, ?, ?, ?, ?)`,
      [appointment_id, prof.id, appt.patient_name, appt.patient_email, content.trim()]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('❌ sendPrescription:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function setDelay(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { delay_minutes } = req.body;

  if (!delay_minutes || delay_minutes < 1) {
    res.status(400).json({ error: 'Informe os minutos de atraso' });
    return;
  }

  try {
    const [profRows] = await pool.query(
      'SELECT id, specialty_id FROM professionals WHERE user_id = ?', [userId]
    ) as any[];
    const prof = (profRows as any[])[0];
    if (!prof) {
      res.status(404).json({ error: 'Profissional não encontrado' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const [rows] = await pool.query(
      `SELECT a.id, a.scheduled_time, a.service_id
       FROM appointments a
       INNER JOIN professionals p ON p.id = a.professional_id
       WHERE a.scheduled_date = ?
         AND a.status = 'agendado'
         AND p.specialty_id = ?
         AND a.scheduled_time > CURTIME()
       ORDER BY a.scheduled_time ASC`,
      [today, prof.specialty_id]
    ) as any[];

    const appointments = rows as any[];

    for (const appt of appointments) {
      await pool.query(
        `UPDATE appointments
         SET scheduled_time = ADDTIME(scheduled_time, SEC_TO_TIME(? * 60))
         WHERE id = ?`,
        [delay_minutes, appt.id]
      );
    }

    await reorganizeQueueBySpecialty(today, prof.specialty_id);

    res.json({
      success: true,
      affected: appointments.length,
      delay_minutes,
    });
  } catch (error) {
    console.error('❌ setDelay:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function reorganizeQueueBySpecialty(
  date: string,
  specialtyId: number
): Promise<void> {
  try {
    const [services] = await pool.query(
      `SELECT DISTINCT a.service_id
       FROM appointments a
       INNER JOIN professionals p ON p.id = a.professional_id
       WHERE a.scheduled_date = ?
         AND p.specialty_id = ?
         AND a.status IN ('agendado','em_atendimento')`,
      [date, specialtyId]
    ) as any[];

    for (const svc of services as any[]) {
      const [appts] = await pool.query(
        `SELECT id FROM appointments
         WHERE scheduled_date = ?
           AND service_id = ?
           AND status IN ('agendado','em_atendimento')
         ORDER BY
           CASE WHEN status = 'em_atendimento' THEN 1 ELSE 2 END,
           scheduled_time ASC`,
        [date, svc.service_id]
      ) as any[];

      for (let i = 0; i < (appts as any[]).length; i++) {
        await pool.query(
          'UPDATE appointments SET queue_position = ? WHERE id = ?',
          [i + 1, (appts as any[])[i].id]
        );
      }
    }
  } catch (error) {
    console.error('❌ reorganizeQueueBySpecialty:', error);
  }
}


export async function updateMySpecialty(
  req: Request, res: Response
): Promise<void> {
  const userId = req.user!.id;
  const { specialty_id } = req.body;

  if (!specialty_id) {
    res.status(400).json({ error: 'Especialidade obrigatória' });
    return;
  }

  try {
    await pool.query(
      'UPDATE professionals SET specialty_id = ? WHERE user_id = ?',
      [specialty_id, userId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('❌ updateMySpecialty:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function updateMyServices(
  req: Request, res: Response
): Promise<void> {
  const userId = req.user!.id;
  const { service_ids } = req.body;

  if (!Array.isArray(service_ids)) {
    res.status(400).json({ error: 'service_ids deve ser um array' });
    return;
  }

  const conn = await pool.getConnection();
  try {
    // buscar o professional_id pelo user_id
    const [profRows] = await conn.query(
      'SELECT id FROM professionals WHERE user_id = ?', [userId]
    ) as any[];

    const prof = (profRows as any[])[0];
    if (!prof) {
      res.status(404).json({ error: 'Profissional não encontrado' });
      return;
    }

    await conn.beginTransaction();

    // ✅ limpar serviços antigos e inserir novos
    await conn.query(
      'DELETE FROM professional_services WHERE professional_id = ?',
      [prof.id]
    );

    for (const sid of service_ids) {
      await conn.query(
        'INSERT IGNORE INTO professional_services (professional_id, service_id) VALUES (?, ?)',
        [prof.id, sid]
      );
    }

    await conn.commit();
    res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    console.error('❌ updateMyServices:', error);
    res.status(500).json({ error: 'Erro interno' });
  } finally {
    conn.release();
  }
}