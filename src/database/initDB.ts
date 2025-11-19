import database from './index';

export function initDatabase() {
  try {
    console.log('🔄 Iniciando banco de dados...');

    // ✅ Criar tabela users com estrutura correta (sem updated_at problemático)
    database.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela users criada');

    // ✅ Verificar e adicionar colunas que podem estar faltando
    try {
      const tableInfo = database.getAllSync("PRAGMA table_info(users);") as any[];
      const columnNames = tableInfo.map(col => col.name);
      
      // Verificar role
      if (!columnNames.includes('role')) {
        console.log('🔧 Adicionando coluna role...');
        database.execSync(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';`);
        console.log('✅ Coluna role adicionada');
      } else {
        console.log('ℹ️ Coluna role já existe');
      }

      // ✅ NÃO adicionar updated_at - vamos usar uma abordagem diferente
      if (!columnNames.includes('updated_at')) {
        console.log('🔧 Adicionando coluna updated_at (sem default)...');
        database.execSync(`ALTER TABLE users ADD COLUMN updated_at TEXT;`);
        console.log('✅ Coluna updated_at adicionada');
      } else {
        console.log('ℹ️ Coluna updated_at já existe');
      }

    } catch (error) {
      console.log('ℹ️ Erro esperado ao verificar/adicionar colunas:', error);
    }

    // ✅ Criar índices
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`);
    console.log('✅ Índices criados');

   

    // ✅ Outras tabelas
    database.execSync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    database.execSync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        theme TEXT DEFAULT 'light',
        notifications_enabled INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // ✅ NOVA TABELA: Agendamentos
    database.execSync(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        user_email TEXT NOT NULL,
        service_type TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'agendado' CHECK(status IN ('agendado', 'em_atendimento', 'concluido', 'cancelado')),
        queue_position INTEGER,
        scheduled_date TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        attended_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Tabela appointments criada');

    

    // Índices adicionais
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);`);
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);`);
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);`);

    // Índices para agendamentos
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);`);
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);`);
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date);`);
    database.execSync(`CREATE INDEX IF NOT EXISTS idx_appointments_queue ON appointments(queue_position);`);

    console.log('✅ Todas as tabelas e índices criados');

    const tables = database.getAllSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    console.log('🎉 Banco inicializado! Tabelas:', tables.map(t => t.name).join(', '));
    return true;

  } catch (error: any) {
    console.error('❌ Erro crítico ao inicializar banco:', error);
    throw error;
  }
}

// Re-exportar funções do utils
export { 
  seedDatabase, 
  getDatabaseStats, 
  resetDatabase,
  clearAllData,
  backupDatabase,
  checkDatabaseIntegrity,
  optimizeDatabase,
  dbUtils
} from './utils';