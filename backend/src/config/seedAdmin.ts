import bcrypt from 'bcryptjs';
import { pool } from './database';

export async function seedAdmin(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    // Verificar se já existe admin
    const [rows] = await conn.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    ) as any[];

    if ((rows as any[]).length > 0) {
      console.log('ℹ️ Admin já existe — seed ignorado');
      return;
    }

    const hashed = await bcrypt.hash('Admin123', 10);

    await conn.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, 'admin')`,
      ['Administrador', 'adm01@gmail.com', hashed]
    );

    console.log('✅ Admin criado!');
    console.log('   📧 Email: adm01@gmail.com');
    console.log('   🔑 Senha: Admin123');
  } catch (error: any) {
    console.error('❌ Erro ao criar admin:', error.message);
  } finally {
    conn.release();
  }
}