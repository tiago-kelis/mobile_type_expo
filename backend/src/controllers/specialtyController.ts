import { Request, Response } from 'express';
import { pool } from '../config/database';

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM specialties WHERE active = 1 ORDER BY name ASC'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const { name } = req.body;
  if (!name?.trim()) {
    res.status(400).json({ error: 'Nome é obrigatório' });
    return;
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO specialties (name) VALUES (?)',
      [name.trim()]
    ) as any[];
    res.status(201).json({ id: (result as any).insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Especialidade já cadastrada' });
    } else {
      res.status(500).json({ error: 'Erro interno' });
    }
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    // Verificar se há profissionais usando
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM professionals WHERE specialty_id = ?',
      [id]
    ) as any[];

    if ((rows as any[])[0].count > 0) {
      res.status(409).json({
        error: 'Não é possível excluir: há profissionais com esta especialidade',
      });
      return;
    }

    await pool.query('DELETE FROM specialties WHERE id = ?', [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
}