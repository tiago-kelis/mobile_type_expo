import { Request, Response } from 'express';
import { pool } from '../config/database';

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM services ORDER BY name ASC'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getActive(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM services WHERE active = 1 ORDER BY name ASC'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const { name, description, duration_min } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Nome é obrigatório' });
    return;
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO services (name, description, duration_min) VALUES (?, ?, ?)',
      [name, description || null, duration_min || 30]
    ) as any[];
    res.status(201).json({ id: result.insertId });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, description, duration_min } = req.body;
  try {
    await pool.query(
      'UPDATE services SET name = ?, description = ?, duration_min = ? WHERE id = ?',
      [name, description, duration_min, id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function toggleActive(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE services SET active = NOT active WHERE id = ?',
      [id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    // ✅ Verificar TODOS os agendamentos — não só os ativos
    const [allRows] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE service_id = ?',
      [id]
    ) as any[];

    const total = (allRows as any[])[0].count;

    if (total > 0) {
      // ✅ Se tem histórico, apenas desativar (soft delete)
      await pool.query('UPDATE services SET active = 0 WHERE id = ?', [id]);
      res.json({ success: true, message: 'Serviço desativado (possui histórico de agendamentos)' });
      return;
    }

    // Sem agendamentos — pode excluir fisicamente
    await pool.query('DELETE FROM professional_services WHERE service_id = ?', [id]);
    await pool.query('DELETE FROM services WHERE id = ?', [id]);

    res.json({ success: true, message: 'Serviço excluído' });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}