import database from './index';

// ✅ Função para criar todas as tabelas
export function initDatabase() {
  try {
    console.log('🔄 Iniciando banco de dados...');

    // Criar tabela de usuários
    database.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela users criada');

    // Criar índice para email (melhor performance)
    database.execSync(`
      CREATE INDEX IF NOT EXISTS idx_users_email 
      ON users(email);
    `);
    console.log('✅ Índice de email criado');

    // Criar tabela de sessões
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
    console.log('✅ Tabela sessions criada');

    // Criar tabela de configurações
    database.execSync(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        theme TEXT DEFAULT 'light',
        notifications_enabled INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Tabela settings criada');

    // Verificar tabelas criadas
    const tables = database.getAllSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    console.log('✅ Banco de dados inicializado com sucesso!');
    console.log('📊 Tabelas criadas:', tables.map(t => t.name).join(', '));

    return true;
  } catch (error: any) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
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