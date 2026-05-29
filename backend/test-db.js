require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  try {
    const pool = mysql.createPool({
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT),
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const conn = await pool.getConnection();
    console.log('✅ MySQL conectado com sucesso!');
    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

test();