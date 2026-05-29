import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password, crm } = req.body;

  if ((!email && !crm) || !password) {
    res.status(400).json({ error: 'Credenciais obrigatórias' });
    return;
  }

  try {
    let userRow: any;

    if (crm) {
      // ✅ login por CRM — busca via tabela professionals
      const [rows] = await pool.query(
        `SELECT u.* FROM users u
         INNER JOIN professionals p ON p.user_id = u.id
         WHERE p.crm = ? AND u.role = 'professional'`,
        [crm.trim()]
      ) as any[];
      userRow = (rows as any[])[0];
    } else {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email.trim().toLowerCase()]
      ) as any[];
      userRow = (rows as any[])[0];
    }

    if (!userRow) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const valid = await bcrypt.compare(password, userRow.password);
    if (!valid) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: userRow.id, email: userRow.email, role: userRow.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.json({
      token,
      user: {
        id:         userRow.id,
        name:       userRow.name,
        email:      userRow.email,
        role:       userRow.role,
        created_at: userRow.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    return;
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    ) as any[];

    if ((existing as any[]).length > 0) {
      res.status(409).json({ error: 'Email já cadastrado' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashed, 'user']
    ) as any[];

    res.status(201).json({ id: result.insertId, message: 'Usuário criado' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}


export async function registerProfessional(
  req: Request, res: Response
): Promise<void> {
  const { name, email, password, crm } = req.body;

  if (!name || !email || !password || !crm) {
    res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    return;
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    // ✅ cria usuário com role 'user' — admin aprova depois
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, 'user')`,
      [name.trim(), email.trim().toLowerCase(), hash]
    ) as any[];

    const userId = (result as any).insertId;

    // ✅ cria registro de profissional vinculado — sem especialidade ainda
    await pool.query(
      `INSERT INTO professionals (name, crm, user_id, active, on_duty)
       VALUES (?, ?, ?, 0, 0)`,
      [name.trim(), crm.trim(), userId]
    );

    res.status(201).json({
      message: 'Cadastro recebido. Aguarde aprovação do administrador.',
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'E-mail já cadastrado' });
      return;
    }
    res.status(500).json({ error: 'Erro interno' });
  }
}


