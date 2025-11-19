import database from '../index';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at?: string;
}

// ✅ Função auxiliar para verificar se coluna existe
function columnExists(tableName: string, columnName: string): boolean {
  try {
    const tableInfo = database.getAllSync("PRAGMA table_info(" + tableName + ");") as any[];
    return tableInfo.some(col => col.name === columnName);
  } catch (error) {
    return false;
  }
}

// ✅ Validar login (versão segura)
export function validateLogin(
  email: string,
  password: string
): Omit<User, 'password'> | null {
  try {
    console.log('🔍 Iniciando validação de login para:', email);
    
    // Verificar quais colunas existem
    const hasRole = columnExists('users', 'role');
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    console.log('📋 Colunas disponíveis - role:', hasRole, 'updated_at:', hasUpdatedAt);
    
    // Construir query baseada nas colunas disponíveis
    let selectFields = 'id, name, email, password, created_at';
    if (hasRole) selectFields += ', role';
    if (hasUpdatedAt) selectFields += ', updated_at';
    
    const query = `SELECT ${selectFields} FROM users WHERE email = ? AND password = ?`;
    console.log('🔍 Query a ser executada:', query);
    
    const userWithPassword = database.getFirstSync<any>(query, [email, password]);
    
    if (userWithPassword) {
      console.log('✅ Usuário encontrado:', userWithPassword.email);
      
      // Garantir que role existe, mesmo que não esteja no banco
      if (!hasRole || !userWithPassword.role) {
        userWithPassword.role = 'user'; // Valor padrão
        console.log('ℹ️ Role definido como padrão: user');
      }
      
      console.log('🔐 Role do usuário:', userWithPassword.role);
      
      // Remover senha e retornar
      const { password: _, ...userWithoutPassword } = userWithPassword;
      return userWithoutPassword;
    } else {
      console.log('❌ Credenciais inválidas para:', email);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao validar login:', error);
    throw error;
  }
}

// ✅ Buscar todos os usuários (versão segura)
export function getAllUsers(): Omit<User, 'password'>[] {
  try {
    const hasRole = columnExists('users', 'role');
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let selectFields = 'id, name, email, created_at';
    if (hasRole) selectFields += ', role';
    if (hasUpdatedAt) selectFields += ', updated_at';
    
    const query = `SELECT ${selectFields} FROM users ORDER BY created_at DESC`;
    const result = database.getAllSync<any>(query);
    
    // Garantir que todos tenham role
    return (result || []).map(user => ({
      ...user,
      role: user.role || 'user' // Garantir role padrão
    }));
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    return [];
  }
}

// ✅ Buscar usuário por ID (versão segura)
export function getUserById(id: number): Omit<User, 'password'> | null {
  try {
    const hasRole = columnExists('users', 'role');
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let selectFields = 'id, name, email, created_at';
    if (hasRole) selectFields += ', role';
    if (hasUpdatedAt) selectFields += ', updated_at';
    
    const query = `SELECT ${selectFields} FROM users WHERE id = ?`;
    const result = database.getFirstSync<any>(query, [id]);
    
    if (result) {
      // Garantir role padrão
      if (!result.role) result.role = 'user';
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    return null;
  }
}

// ✅ Buscar usuário por email (versão segura)
export function getUserByEmail(email: string): Omit<User, 'password'> | null {
  try {
    const hasRole = columnExists('users', 'role');
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let selectFields = 'id, name, email, created_at';
    if (hasRole) selectFields += ', role';
    if (hasUpdatedAt) selectFields += ', updated_at';
    
    const query = `SELECT ${selectFields} FROM users WHERE email = ?`;
    const result = database.getFirstSync<any>(query, [email]);
    
    if (result) {
      if (!result.role) result.role = 'user';
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    return null;
  }
}




// ✅ Função para atualizar updated_at manualmente
function updateTimestamp(tableName: string, id: number): void {
  try {
    const hasUpdatedAt = columnExists(tableName, 'updated_at');
    if (hasUpdatedAt) {
      database.runSync(
        `UPDATE ${tableName} SET updated_at = datetime('now') WHERE id = ?`,
        [id]
      );
    }
  } catch (error) {
    console.log('ℹ️ Não foi possível atualizar timestamp:', error);
  }
}



// ✅ Promover usuário (com timestamp manual)
export function promoteToAdmin(userId: number): boolean {
  try {
    const hasRole = columnExists('users', 'role');
    
    if (!hasRole) {
      console.log('⚠️ Coluna role não existe');
      return false;
    }
    
    const result = database.runSync(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', userId]
    );
    
    const success = result.changes > 0;
    
    if (success) {
      updateTimestamp('users', userId); // ✅ Atualizar timestamp manualmente
      console.log('✅ Usuário promovido a admin:', userId);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
    return false;
  }
}



// ✅ Rebaixar admin (com timestamp manual)
export function demoteFromAdmin(userId: number): boolean {
  try {
    const hasRole = columnExists('users', 'role');
    
    if (!hasRole) {
      console.log('⚠️ Coluna role não existe');
      return false;
    }
    
    const result = database.runSync(
      'UPDATE users SET role = ? WHERE id = ?',
      ['user', userId]
    );
    
    const success = result.changes > 0;
    
    if (success) {
      updateTimestamp('users', userId); // ✅ Atualizar timestamp manualmente
      console.log('✅ Usuário rebaixado para user:', userId);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao rebaixar usuário:', error);
    return false;
  }
}




// ✅ Criar usuário (versão segura)
export function createUser(
  name: string,
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user'
): number {
  try {
    const hasRole = columnExists('users', 'role');
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let query: string;
    let params: any[];
    
    if (hasRole && hasUpdatedAt) {
      query = 'INSERT INTO users (name, email, password, role, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';
      params = [name, email, password, role];
    } else if (hasRole) {
      query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      params = [name, email, password, role];
    } else {
      query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      params = [name, email, password];
    }
    
    const result = database.runSync(query, params);
    console.log('✅ Usuário criado com ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário:', error);
    
    if (error.message?.includes('UNIQUE constraint failed')) {
      throw new Error('Este email já está cadastrado');
    }
    throw error;
  }
}


// database/services/userServices.ts
export function makeUserAdmin(email: string): boolean {
  try {
    console.log(`🔧 Promovendo ${email} para admin...`);
    
    const result = database.runSync(
      'UPDATE users SET role = ?, updated_at = datetime("now") WHERE email = ?',
      ['admin', email]
    );
    
    if (result.changes > 0) {
      console.log(`✅ ${email} promovido para admin`);
      return true;
    } else {
      console.log(`❌ Usuário ${email} não encontrado`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
    return false;
  }
}



// database/services/userServices.ts - Adicione esta função
export function forceCreateAdmin(): boolean {
  try {
    console.log('🔧 Forçando criação de admin...');
    
    // Primeiro, verificar se já existe admin@sistema.com
    const existingAdmin = database.getFirstSync(
      'SELECT * FROM users WHERE email = ?',
      ['admin@sistema.com']
    );
    
    if (existingAdmin) {
      console.log('📝 Admin encontrado:', existingAdmin);
      
      // Se existe mas não é admin, promover
      if ((existingAdmin as any).role !== 'admin') {
        console.log('🔄 Promovendo usuário existente para admin...');
        database.runSync(
          'UPDATE users SET role = ? WHERE email = ?',
          ['admin', 'admin@sistema.com']
        );
        console.log('✅ Usuário promovido para admin');
      } else {
        console.log('✅ Admin já existe com role correto');
      }
      return true;
    }
    
    // Se não existe, criar
    console.log('🆕 Criando novo admin...');
    const result = database.runSync(`
      INSERT INTO users (name, email, password, role, created_at, updated_at) 
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [
      'Administrador Sistema',
      'admin@sistema.com',
      'admin123',
      'admin'
    ]);
    
    if (result.changes > 0) {
      console.log('✅ Admin criado com sucesso!');
      console.log('   📧 Email: admin@sistema.com');
      console.log('   🔑 Senha: admin123');
      return true;
    } else {
      console.log('❌ Falha ao criar admin');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erro ao forçar criação de admin:', error);
    return false;
  }
}



// database/services/userServices.ts - Adicione esta função
export function debugAllUsers(): void {
  try {
    console.log('🔍 === DEBUG COMPLETO DE USUÁRIOS ===');
    
    const users = database.getAllSync('SELECT * FROM users');
    
    console.log(`📊 Total de usuários: ${users.length}`);
    
    users.forEach((user: any, index) => {
      console.log(`\n👤 Usuário ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Senha: ${user.password}`); // ⚠️ Só para debug - remover depois
      console.log(`   Criado: ${user.created_at}`);
    });

    // Verificar especificamente admins
    const admins = database.getAllSync('SELECT * FROM users WHERE role = ?', ['admin']);
    console.log(`\n👑 Administradores encontrados: ${admins.length}`);
    
    admins.forEach((admin: any, index) => {
      console.log(`\n🔑 Admin ${index + 1}:`);
      console.log(`   Nome: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Senha: ${admin.password}`);
    });

  } catch (error) {
    console.error('❌ Erro no debug:', error);
  }
}




// ✅ Atualizar usuário (versão segura)
export function updateUser(id: number, name: string, email: string): boolean {
  try {
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let query: string;
    if (hasUpdatedAt) {
      query = 'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    } else {
      query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    }
    
    const result = database.runSync(query, [name, email, id]);
    const success = result.changes > 0;
    
    if (success) {
      console.log('✅ Usuário atualizado:', id);
    } else {
      console.log('❌ Usuário não encontrado para atualizar:', id);
    }
    
    return success;
  } catch (error: any) {
    console.error('❌ Erro ao atualizar usuário:', error);
    
    if (error.message?.includes('UNIQUE constraint failed')) {
      throw new Error('Este email já está em uso');
    }
    return false;
  }
}

// ✅ Atualizar senha (com timestamp manual)
export function updatePassword(id: number, newPassword: string): boolean {
  try {
    const result = database.runSync(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, id]
    );
    
    const success = result.changes > 0;
    
    if (success) {
      updateTimestamp('users', id); // ✅ Atualizar timestamp
      console.log('✅ Senha atualizada:', id);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error);
    return false;
  }
}





// ✅ Deletar usuário
export function deleteUser(id: number): boolean {
  try {
    const result = database.runSync('DELETE FROM users WHERE id = ?', [id]);
    const success = result.changes > 0;
    
    if (success) {
      console.log('✅ Usuário deletado:', id);
    } else {
      console.log('❌ Usuário não encontrado para deletar:', id);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    return false;
  }
}

// ✅ Contar usuários por role (versão segura)
export function getUserCountByRole(): { users: number; admins: number } {
  try {
    const hasRole = columnExists('users', 'role');
    
    if (!hasRole) {
      // Se não tem coluna role, todos são considerados usuários
      const total = database.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM users'
      )?.count || 0;
      
      return { users: total, admins: 0 };
    }
    
    const users = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      ['user']
    )?.count || 0;
    
    const admins = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      ['admin']
    )?.count || 0;
    
    return { users, admins };
  } catch (error) {
    console.error('❌ Erro ao contar usuários:', error);
    return { users: 0, admins: 0 };
  }
}


// ✅ Verificar se email existe
export function emailExists(email: string, excludeUserId?: number): boolean {
  try {
    let query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    let params: any[] = [email];
    
    if (excludeUserId) {
      query += ' AND id != ?';
      params.push(excludeUserId);
    }
    
    const result = database.getFirstSync<{ count: number }>(query, params);
    return result ? result.count > 0 : false;
  } catch (error) {
    console.error('❌ Erro ao verificar email:', error);
    return true;
  }
}

// ✅ Contar total de usuários
export function countUsers(): number {
  try {
    const result = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );
    return result?.count || 0;
  } catch (error) {
    console.error('❌ Erro ao contar usuários:', error);
    return 0;
  }
}

// ✅ Verificar se banco está vazio
export function isDatabaseEmpty(): boolean {
  return countUsers() === 0;
}

// ========== 🔧 NOVAS FUNÇÕES PARA ADMINISTRADORES ==========

// ✅ Verificar se admin existe
export function verifyAdminExists(): boolean {
  try {
    const hasRole = columnExists('users', 'role');
    
    let query: string;
    let params: any[];
    
    if (hasRole) {
      query = 'SELECT id, name, email, role FROM users WHERE role = ? LIMIT 1';
      params = ['admin'];
    } else {
      query = 'SELECT id, name, email FROM users WHERE email = ? LIMIT 1';
      params = ['admin@sistema.com'];
    }
    
    const admin = database.getFirstSync<any>(query, params);
    
    if (admin) {
      console.log('✅ Admin encontrado:', {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role || 'admin (assumido)'
      });
      return true;
    } else {
      console.log('❌ Nenhum admin encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar admin:', error);
    return false;
  }
}

// ✅ Criar admin manualmente
export function createAdminUser(
  name: string = 'Administração',
  email: string = 'adm01@gmail.com',
  password: string = 'admin123AAA'
): boolean {
  try {
    // Verificar se já existe
    const exists = emailExists(email);
    if (exists) {
      console.log('⚠️ Admin com este email já existe');
      return false;
    }
    
    const userId = createUser(name, email, password, 'admin');
    
    if (userId > 0) {
      console.log('✅ Admin criado com sucesso:', {
        id: userId,
        name,
        email,
        role: 'admin'
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    return false;
  }
}

// ✅ Listar todos os admins
export function getAllAdmins(): Omit<User, 'password'>[] {
  try {
    const hasRole = columnExists('users', 'role');
    
    if (!hasRole) {
      // Se não tem role, buscar pelo email conhecido
      const admin = database.getFirstSync<any>(
        'SELECT id, name, email, created_at FROM users WHERE email = ?',
        ['admin@sistema.com']
      );
      return admin ? [{ ...admin, role: 'admin' as const }] : [];
    }
    
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let selectFields = 'id, name, email, role, created_at';
    if (hasUpdatedAt) selectFields += ', updated_at';
    
    const result = database.getAllSync<any>(
      `SELECT ${selectFields} FROM users WHERE role = ?`,
      ['admin']
    );
    
    return result || [];
  } catch (error) {
    console.error('❌ Erro ao buscar admins:', error);
    return [];
  }
}

// ✅ Verificar se usuário é admin
export function isUserAdmin(userId: number): boolean {
  try {
    const hasRole = columnExists('users', 'role');
    
    if (!hasRole) {
      // Verificar se é o admin padrão pelo email
      const user = database.getFirstSync<any>(
        'SELECT email FROM users WHERE id = ?',
        [userId]
      );
      return user?.email === 'admin@sistema.com';
    }
    
    const result = database.getFirstSync<any>(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );
    
    return result?.role === 'admin';
  } catch (error) {
    console.error('❌ Erro ao verificar se usuário é admin:', error);
    return false;
  }
}

// ✅ Criar admin a partir de usuário existente
export function convertUserToAdmin(userId: number): boolean {
  try {
    const user = getUserById(userId);
    
    if (!user) {
      console.log('❌ Usuário não encontrado:', userId);
      return false;
    }
    
    if (user.role === 'admin') {
      console.log('ℹ️ Usuário já é admin:', user.name);
      return true;
    }
    
    const success = promoteToAdmin(userId);
    
    if (success) {
      console.log('✅ Usuário convertido para admin:', user.name);
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao converter usuário para admin:', error);
    return false;
  }
}

// ✅ Debug - Verificar estrutura da tabela
export function debugUserTable(): void {
  try {
    console.log('🔍 === DEBUG DA TABELA USERS ===');
    
    // Verificar estrutura
    const tableInfo = database.getAllSync("PRAGMA table_info(users);") as any[];
    console.log('📋 Colunas da tabela:');
    tableInfo.forEach(col => {
      console.log(`   - ${col.name}: ${col.type}${col.dflt_value ? ` (default: ${col.dflt_value})` : ''}`);
    });
    
    // Listar todos os usuários
    const allUsers = getAllUsers();
    console.log('👥 Usuários cadastrados:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Contar por role
    const counts = getUserCountByRole();
    console.log('📊 Contadores:');
    console.log(`   - Usuários: ${counts.users}`);
    console.log(`   - Admins: ${counts.admins}`);
    
    // Verificar admin específico
    const adminExists = verifyAdminExists();
    console.log('👑 Admin padrão existe:', adminExists);
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
  }
}

// ✅ Buscar usuários por role específico
export function getUsersByRole(role: 'user' | 'admin'): Omit<User, 'password'>[] {
  try {
    const hasRole = columnExists('users', 'role');
    
    if (!hasRole) {
      if (role === 'admin') {
        // Retornar admin padrão se existir
        const admin = getUserByEmail('admin@sistema.com');
        return admin ? [{ ...admin, role: 'admin' as const }] : [];
      } else {
        // Retornar todos exceto admin padrão
        return getAllUsers().filter(user => user.email !== 'admin@sistema.com');
      }
    }
    
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let selectFields = 'id, name, email, role, created_at';
    if (hasUpdatedAt) selectFields += ', updated_at';
    
    const result = database.getAllSync<any>(
      `SELECT ${selectFields} FROM users WHERE role = ? ORDER BY created_at DESC`,
      [role]
    );
    
    return result || [];
  } catch (error) {
    console.error('❌ Erro ao buscar usuários por role:', error);
    return [];
  }
}

// ✅ Resetar senha de admin (emergência)
export function resetAdminPassword(newPassword: string = 'admin123'): boolean {
  try {
    const hasUpdatedAt = columnExists('users', 'updated_at');
    
    let query: string;
    if (hasUpdatedAt) {
      query = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?';
    } else {
      query = 'UPDATE users SET password = ? WHERE email = ?';
    }
    
    const result = database.runSync(query, [newPassword, 'admin@sistema.com']);
    const success = result.changes > 0;
    
    if (success) {
      console.log('✅ Senha do admin resetada com sucesso');
    } else {
      console.log('❌ Admin não encontrado para resetar senha');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Erro ao resetar senha do admin:', error);
    return false;
  }
}