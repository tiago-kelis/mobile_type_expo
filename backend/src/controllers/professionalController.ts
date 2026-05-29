import { Request, Response } from 'express';
import { pool } from '../config/database';

const SELECT_PROFESSIONALS = `
  SELECT
    p.*,
    sp.name as specialty,
    GROUP_CONCAT(ps.service_id) as service_ids,
    GROUP_CONCAT(s.name SEPARATOR '||') as service_names,
    CASE WHEN u.role = 'professional' THEN 1 ELSE 0 END as user_approved
  FROM professionals p
  LEFT JOIN specialties sp ON sp.id = p.specialty_id
  LEFT JOIN professional_services ps ON ps.professional_id = p.id
  LEFT JOIN services s ON s.id = ps.service_id
  LEFT JOIN users u ON u.id = p.user_id
`;

function formatProfessionals(rows: any[]): any[] {
  return rows.map(p => ({
    ...p,
    service_ids:   p.service_ids   ? p.service_ids.split(',').map(Number) : [],
    service_names: p.service_names ? p.service_names.split('||') : [],
  }));
}

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query(
      `${SELECT_PROFESSIONALS}
       GROUP BY p.id
       ORDER BY p.name ASC`
    ) as any[];
    res.json(formatProfessionals(rows as any[]));
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getOnDuty(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query(
      `${SELECT_PROFESSIONALS}
       WHERE p.on_duty = 1 AND p.active = 1
       GROUP BY p.id
       ORDER BY p.name ASC`
    ) as any[];
    res.json(formatProfessionals(rows as any[]));
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getByService(req: Request, res: Response): Promise<void> {
  const { serviceId } = req.params;
  try {
    const [rows] = await pool.query(
      `${SELECT_PROFESSIONALS}
       INNER JOIN professional_services ps2 ON ps2.professional_id = p.id
       WHERE ps2.service_id = ?
         AND p.active  = 1
         AND p.on_duty = 1
       GROUP BY p.id
       ORDER BY p.name ASC`,
      [serviceId]
    ) as any[];
    res.json(formatProfessionals(rows as any[]));
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const { name, specialty_id, crm, service_ids } = req.body;

  if (!name || !specialty_id) {
    res.status(400).json({ error: 'Nome e especialidade são obrigatórios' });
    return;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO professionals (name, specialty_id, crm) VALUES (?, ?, ?)',
      [name, specialty_id, crm || null]
    ) as any[];

    const profId = (result as any).insertId;

    if (Array.isArray(service_ids) && service_ids.length > 0) {
      for (const sid of service_ids) {
        await conn.query(
          'INSERT IGNORE INTO professional_services (professional_id, service_id) VALUES (?, ?)',
          [profId, sid]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ id: profId });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: 'Erro interno' });
  } finally {
    conn.release();
  }
}

export async function updateServices(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { service_ids } = req.body;

  if (!Array.isArray(service_ids)) {
    res.status(400).json({ error: 'service_ids deve ser um array' });
    return;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM professional_services WHERE professional_id = ?', [id]);
    for (const sid of service_ids) {
      await conn.query(
        'INSERT IGNORE INTO professional_services (professional_id, service_id) VALUES (?, ?)',
        [id, sid]
      );
    }
    await conn.commit();
    res.json({ success: true });
  } catch {
    await conn.rollback();
    res.status(500).json({ error: 'Erro interno' });
  } finally {
    conn.release();
  }
}

export async function toggleDuty(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    await pool.query('UPDATE professionals SET on_duty = NOT on_duty WHERE id = ?', [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function toggleActive(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    await pool.query('UPDATE professionals SET active = NOT active WHERE id = ?', [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM professionals WHERE id = ?', [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}


export async function approveProfessional(
  req: Request, res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    // ✅ ativa o profissional e muda role do user para 'professional'
    await pool.query(
      `UPDATE users u
       INNER JOIN professionals p ON p.user_id = u.id
       SET u.role = 'professional', p.active = 1
       WHERE p.id = ?`,
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
}