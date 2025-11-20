import database from './index';
import { createUser } from './services/userServices';

// ✅ Adicionar dados de exemplo para testes
// ✅ SOLUÇÃO: Desabilitar criação automática
export function seedDatabase() {
  try {
    console.log('🌱 Seed do banco de dados chamado...');

    // Verificar se já tem usuários
    const userCount = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );

    if (userCount && userCount.count > 0) {
      console.log('⚠️ Banco já contém dados. Seed cancelado.');
      console.log(`   Total de usuários existentes: ${userCount.count}`);
      return false;
    }

    // ✅ NOVO: Não criar usuários automaticamente
    console.log('💡 Banco vazio detectado.');
    console.log('   Para criar usuários de teste, execute: seedTestUsers()');
    console.log('   Para criar apenas admin, execute: createAdminUser()');
    
    return false; // ← Retorna false para não criar nada
  } catch (error: any) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  }
}

// ✅ Obter estatísticas completas do banco
export function getDatabaseStats() {
  try {
    console.log('\n📊 Obtendo estatísticas do banco de dados...');

    // Contar usuários
    const userCount = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );

    // Contar sessões
    const sessionCount = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sessions'
    );

    // Contar configurações
    const settingsCount = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM settings'
    );

    // Usuário mais recente
    const lastUser = database.getFirstSync<{ name: string; email: string; created_at: string }>(
      'SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 1'
    );

    // Usuário mais antigo
    const firstUser = database.getFirstSync<{ name: string; email: string; created_at: string }>(
      'SELECT name, email, created_at FROM users ORDER BY created_at ASC LIMIT 1'
    );

    // Tamanho aproximado do banco (em páginas)
    const dbSize = database.getFirstSync<{ page_count: number }>(
      'PRAGMA page_count'
    );

    const pageSize = database.getFirstSync<{ page_size: number }>(
      'PRAGMA page_size'
    );

    const stats = {
      users: userCount?.count || 0,
      sessions: sessionCount?.count || 0,
      settings: settingsCount?.count || 0,
      lastUser: lastUser,
      firstUser: firstUser,
      databaseSize: {
        pages: dbSize?.page_count || 0,
        pageSize: pageSize?.page_size || 0,
        totalBytes: ((dbSize?.page_count || 0) * (pageSize?.page_size || 0)),
        totalKB: (((dbSize?.page_count || 0) * (pageSize?.page_size || 0)) / 1024).toFixed(2),
      }
    };

    // Exibir estatísticas formatadas
    console.log('\n┌─────────────────────────────────────┐');
    console.log('│   📊 ESTATÍSTICAS DO BANCO          │');
    console.log('├─────────────────────────────────────┤');
    console.log(`│ 👥 Usuários:           ${stats.users.toString().padStart(12)} │`);
    console.log(`│ 🔑 Sessões:            ${stats.sessions.toString().padStart(12)} │`);
    console.log(`│ ⚙️  Configurações:      ${stats.settings.toString().padStart(12)} │`);
    console.log('├─────────────────────────────────────┤');
    console.log(`│ 💾 Tamanho:        ${stats.databaseSize.totalKB} KB │`);
    console.log('└─────────────────────────────────────┘');

    if (stats.lastUser) {
      console.log('\n👤 Último usuário cadastrado:');
      console.log(`   Nome: ${stats.lastUser.name}`);
      console.log(`   Email: ${stats.lastUser.email}`);
      console.log(`   Data: ${new Date(stats.lastUser.created_at).toLocaleString('pt-BR')}`);
    }

    if (stats.firstUser) {
      console.log('\n👤 Primeiro usuário cadastrado:');
      console.log(`   Nome: ${stats.firstUser.name}`);
      console.log(`   Email: ${stats.firstUser.email}`);
      console.log(`   Data: ${new Date(stats.firstUser.created_at).toLocaleString('pt-BR')}`);
    }

    return stats;
  } catch (error: any) {
    console.error('❌ Erro ao obter estatísticas:', error);
    throw error;
  }
}

// ✅ Resetar banco de dados (deletar tudo e recriar)
export function resetDatabase() {
  try {
    console.log('\n🔄 Iniciando reset do banco de dados...');
    console.log('⚠️  ATENÇÃO: Todos os dados serão PERMANENTEMENTE deletados!');

    // Obter estatísticas antes de deletar
    const statsBefore = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );
    console.log(`📊 Usuários atuais: ${statsBefore?.count || 0}`);

    // Deletar todas as tabelas na ordem correta (por causa das foreign keys)
    console.log('\n🗑️  Deletando tabelas...');
    
    database.execSync('DROP TABLE IF EXISTS sessions;');
    console.log('   ✅ Tabela sessions deletada');
    
    database.execSync('DROP TABLE IF EXISTS settings;');
    console.log('   ✅ Tabela settings deletada');
    
    database.execSync('DROP TABLE IF EXISTS users;');
    console.log('   ✅ Tabela users deletada');

    // Recriar tabelas
    console.log('\n🏗️  Recriando estrutura do banco...');
    
    // Tabela users
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
    console.log('   ✅ Tabela users recriada');

    // Índice de email
    database.execSync(`
      CREATE INDEX IF NOT EXISTS idx_users_email 
      ON users(email);
    `);
    console.log('   ✅ Índice de email recriado');

    // Tabela sessions
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
    console.log('   ✅ Tabela sessions recriada');

    // Tabela settings
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
    console.log('   ✅ Tabela settings recriada');

    // Verificar se está vazio
    const statsAfter = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );

    console.log('\n✅ Reset concluído com sucesso!');
    console.log(`📊 Usuários após reset: ${statsAfter?.count || 0}`);
    console.log('🎉 Banco de dados limpo e pronto para uso!');

    return true;
  } catch (error: any) {
    console.error('❌ Erro ao resetar banco:', error);
    throw error;
  }
}

// ✅ Limpar apenas os dados (manter estrutura)
export function clearAllData() {
  try {
    console.log('\n🧹 Limpando todos os dados...');

    // Deletar em ordem (por causa das foreign keys)
    database.execSync('DELETE FROM sessions;');
    console.log('   ✅ Sessões deletadas');

    database.execSync('DELETE FROM settings;');
    console.log('   ✅ Configurações deletadas');

    database.execSync('DELETE FROM users;');
    console.log('   ✅ Usuários deletados');

    // Reset dos auto-increment
    database.execSync('DELETE FROM sqlite_sequence;');
    console.log('   ✅ Sequências resetadas');

    console.log('\n✅ Todos os dados foram limpos!');
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao limpar dados:', error);
    throw error;
  }
}

// ✅ Fazer backup dos dados (exportar para objeto)
export function backupDatabase() {
  try {
    console.log('\n💾 Criando backup do banco...');

    const users = database.getAllSync('SELECT * FROM users');
    const sessions = database.getAllSync('SELECT * FROM sessions');
    const settings = database.getAllSync('SELECT * FROM settings');

    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        users,
        sessions,
        settings,
      }
    };

    console.log('✅ Backup criado com sucesso!');
    console.log(`   Usuários: ${users.length}`);
    console.log(`   Sessões: ${sessions.length}`);
    console.log(`   Configurações: ${settings.length}`);

    return backup;
  } catch (error: any) {
    console.error('❌ Erro ao criar backup:', error);
    throw error;
  }
}

// ✅ Verificar integridade do banco
export function checkDatabaseIntegrity(): boolean {
  try {
    console.log('\n🔍 Verificando integridade do banco...');

    const result = database.getFirstSync<{ integrity_check: string }>(
      'PRAGMA integrity_check'
    );
    
    const isOk = result?.integrity_check === 'ok';
    
    if (isOk) {
      console.log('✅ Integridade do banco: OK');
    } else {
      console.error('❌ Integridade do banco: FALHOU');
      console.error('   Resultado:', result?.integrity_check);
    }
    
    return isOk;
  } catch (error: any) {
    console.error('❌ Erro ao verificar integridade:', error);
    return false;
  }
}

// ✅ Otimizar banco (vacuum)
export function optimizeDatabase() {
  try {
    console.log('\n🔧 Otimizando banco de dados...');

    // Obter tamanho antes
    const sizeBefore = database.getFirstSync<{ page_count: number }>(
      'PRAGMA page_count'
    );

    // Executar VACUUM (compactar e otimizar)
    database.execSync('VACUUM;');

    // Analisar para otimizar queries
    database.execSync('ANALYZE;');

    // Obter tamanho depois
    const sizeAfter = database.getFirstSync<{ page_count: number }>(
      'PRAGMA page_count'
    );

    const pageSize = database.getFirstSync<{ page_size: number }>(
      'PRAGMA page_size'
    );

    const savedPages = (sizeBefore?.page_count || 0) - (sizeAfter?.page_count || 0);
    const savedBytes = savedPages * (pageSize?.page_size || 0);
    const savedKB = (savedBytes / 1024).toFixed(2);

    console.log('✅ Otimização concluída!');
    console.log(`   Páginas antes: ${sizeBefore?.page_count || 0}`);
    console.log(`   Páginas depois: ${sizeAfter?.page_count || 0}`);
    console.log(`   Espaço liberado: ${savedKB} KB`);

    return true;
  } catch (error: any) {
    console.error('❌ Erro ao otimizar banco:', error);
    throw error;
  }
}

// ✅ Exportar todas as funções
export const dbUtils = {
  seed: seedDatabase,
  stats: getDatabaseStats,
  reset: resetDatabase,
  clear: clearAllData,
  backup: backupDatabase,
  check: checkDatabaseIntegrity,
  optimize: optimizeDatabase,
};