import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:     Number(   process.env.DB_PORT)    || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'smartclinica',
  waitForConnections: true,
  connectionLimit:    10,
  dateStrings:        true,
});

async function createIndexSafe(
  conn: mysql.PoolConnection,
  index: string,
  table: string,
  column: string
): Promise<void> {
  try {
    await conn.query(`CREATE INDEX ${index} ON ${table}(${column})`);
  } catch {
    // índice já existe — ignorar
  }
}

async function addColumnSafe(
  conn: mysql.PoolConnection,
  table: string,
  column: string,
  definition: string
): Promise<void> {
  try {
    await conn.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`✅ Migração: ${table}.${column} adicionado`);
  } catch {
    // coluna já existe — ignorar
  }
}

async function dropColumnSafe(
  conn: mysql.PoolConnection,
  table: string,
  column: string
): Promise<void> {
  try {
    await conn.query(`ALTER TABLE ${table} DROP COLUMN ${column}`);
    console.log(`✅ Migração: ${table}.${column} removido`);
  } catch {
    // coluna não existe — ignorar
  }
}

async function addForeignKeySafe(
  conn: mysql.PoolConnection,
  table: string,
  constraintName: string,
  column: string,
  refTable: string,
  refColumn: string,
  onDelete: string = 'SET NULL'
): Promise<void> {
  try {
    await conn.query(`
      ALTER TABLE ${table}
      ADD CONSTRAINT ${constraintName}
      FOREIGN KEY (${column}) REFERENCES ${refTable}(${refColumn})
      ON DELETE ${onDelete}
    `);
    console.log(`✅ Migração: FK ${constraintName} adicionada`);
  } catch {
    // FK já existe — ignorar
  }
}

export async function initDatabase(): Promise<void> {
  const conn = await pool.getConnection();

  try {
    console.log('🔄 Iniciando banco de dados MySQL...');

    // ── 1. users ──────────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(150) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       ENUM('user','admin') DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // ✅ Migração: adicionar role 'professional' no ENUM
    try {
      await conn.query(`
        ALTER TABLE users
        MODIFY COLUMN role ENUM('user','admin','professional') DEFAULT 'user'
      `);
      console.log('✅ Migração: role professional adicionado');
    } catch {
      // já existe — ignorar
    }

    // ── 2. specialties ────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS specialties (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL UNIQUE,
        active     TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const defaultSpecialties = [
      'Clínica Geral',      'Cardiologia',        'Dermatologia',
      'Endocrinologia',     'Gastroenterologia',  'Ginecologia',
      'Neurologia',         'Oftalmologia',       'Ortopedia',
      'Otorrinolaringologia','Pediatria',          'Psiquiatria',
      'Urologia',           'Reumatologia',       'Oncologia',
      'Pneumologia',        'Nefrologia',         'Infectologia',
      'Hematologia',        'Cirurgia Geral',
    ];

    for (const name of defaultSpecialties) {
      await conn.query(
        'INSERT IGNORE INTO specialties (name) VALUES (?)',
        [name]
      );
    }
    console.log('✅ Especialidades prontas');

    // ── 3. professionals ──────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(100) NOT NULL,
        specialty    VARCHAR(100),
        specialty_id INT,
        crm          VARCHAR(30),
        active       TINYINT(1) DEFAULT 1,
        on_duty      TINYINT(1) DEFAULT 0,
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // ✅ Migração: garantir specialty_id existe
    await addColumnSafe(conn, 'professionals', 'specialty_id', 'INT');

    // ✅ Migração: garantir user_id existe — vincula professional a user
    await addColumnSafe(conn, 'professionals', 'user_id', 'INT');

    // ✅ Migração: FK specialty
    await addForeignKeySafe(
      conn, 'professionals', 'fk_prof_specialty',
      'specialty_id', 'specialties', 'id', 'SET NULL'
    );

    // ✅ Migração: FK user
    await addForeignKeySafe(
      conn, 'professionals', 'fk_prof_user',
      'user_id', 'users', 'id', 'SET NULL'
    );

    // ✅ Migração: remover coluna specialty VARCHAR antiga
    await dropColumnSafe(conn, 'professionals', 'specialty');

    // ── 4. services ───────────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(100) NOT NULL,
        description  VARCHAR(255),
        duration_min INT DEFAULT 30,
        active       TINYINT(1) DEFAULT 1,
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // ── 5. professional_services (junção) ─────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS professional_services (
        professional_id INT NOT NULL,
        service_id      INT NOT NULL,
        PRIMARY KEY (professional_id, service_id),
        FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id)      REFERENCES services(id)      ON DELETE CASCADE
      );
    `);

    // ── 6. appointments ───────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        user_id         INT NOT NULL,
        user_name       VARCHAR(100) NOT NULL,
        user_email      VARCHAR(150) NOT NULL,
        professional_id INT,
        service_id      INT NOT NULL,
        description     TEXT,
        status          ENUM('agendado','em_atendimento','concluido','cancelado')
                        DEFAULT 'agendado',
        queue_position  INT,
        scheduled_date  DATE NOT NULL,
        scheduled_time  TIME NOT NULL,
        created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        attended_at     DATETIME,
        FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE,
        FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE SET NULL,
        FOREIGN KEY (service_id)      REFERENCES services(id)      ON DELETE RESTRICT
      );
    `);

    // ── 7. prescriptions ──────────────────────────────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id  INT NOT NULL,
        professional_id INT NOT NULL,
        patient_name    VARCHAR(100) NOT NULL,
        patient_email   VARCHAR(150) NOT NULL,
        content         TEXT NOT NULL,
        created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id)  REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
      );
    `);

    // ── índices ───────────────────────────────────────────────────────────────
    await createIndexSafe(conn, 'idx_appt_date',    'appointments', 'scheduled_date');
    await createIndexSafe(conn, 'idx_appt_status',  'appointments', 'status');
    await createIndexSafe(conn, 'idx_appt_user',    'appointments', 'user_id');
    await createIndexSafe(conn, 'idx_appt_service', 'appointments', 'service_id');

    console.log('✅ MySQL — tabelas prontas');
  } finally {
    conn.release();
  }
}