import database from '../index';

// Interface do Usuário
export interface User {
  id: number;  // ✅ Removido opcional - sempre terá ID após criar
  name: string;
  email: string;
  password: string;
  created_at?: string;
}

// ✅ Criar usuário
export function createUser(
  name: string,
  email: string,
  password: string
): number {
  try {
    const result = database.runSync(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    console.log('✅ Usuário criado com ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário:', error);
    
    // Verificar se é erro de email duplicado
    if (error.message?.includes('UNIQUE constraint failed')) {
      throw new Error('Este email já está cadastrado');
    }
    throw error;
  }
}

// ✅ Buscar usuário por email (sem retornar senha)
export function getUserByEmail(email: string): Omit<User, 'password'> | null {
  try {
    const result = database.getFirstSync<User>(
      'SELECT id, name, email, created_at FROM users WHERE email = ?',
      [email]
    );
    return result || null;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    throw error;
  }
}

// ✅ Buscar usuário por ID (sem retornar senha)
export function getUserById(id: number): Omit<User, 'password'> | null {
  try {
    const result = database.getFirstSync<User>(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return result || null;
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    throw error;
  }
}

// ✅ Listar todos os usuários (sem retornar senhas)
export function getAllUsers(): Omit<User, 'password'>[] {
  try {
    const result = database.getAllSync<Omit<User, 'password'>>(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    return result;
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    throw error;
  }
}

// ✅ Atualizar usuário
export function updateUser(
  id: number,
  name: string,
  email: string
): void {
  try {
    const result = database.runSync(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    
    if (result.changes === 0) {
      throw new Error('Usuário não encontrado');
    }
    
    console.log('✅ Usuário atualizado');
  } catch (error: any) {
    console.error('❌ Erro ao atualizar usuário:', error);
    
    if (error.message?.includes('UNIQUE constraint failed')) {
      throw new Error('Este email já está em uso');
    }
    throw error;
  }
}

// ✅ Atualizar senha
export function updatePassword(
  id: number,
  newPassword: string
): void {
  try {
    const result = database.runSync(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, id]
    );
    
    if (result.changes === 0) {
      throw new Error('Usuário não encontrado');
    }
    
    console.log('✅ Senha atualizada');
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error);
    throw error;
  }
}

// ✅ Deletar usuário
export function deleteUser(id: number): void {
  try {
    const result = database.runSync(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    if (result.changes === 0) {
      throw new Error('Usuário não encontrado');
    }
    
    console.log('✅ Usuário deletado');
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    throw error;
  }
}

// ✅ Validar login (retorna usuário sem senha)
export function validateLogin(
  email: string,
  password: string
): Omit<User, 'password'> | null {
  try {
    // Buscar usuário com senha para validar
    const userWithPassword = database.getFirstSync<User>(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (userWithPassword) {
      console.log('✅ Login válido para:', userWithPassword.email);
      
      // Retornar usuário sem a senha
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

// ✅ Verificar se email já existe
export function emailExists(email: string): boolean {
  try {
    const result = database.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email]
    );
    return result ? result.count > 0 : false;
  } catch (error) {
    console.error('❌ Erro ao verificar email:', error);
    throw error;
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
    throw error;
  }
}

// ✅ Limpar todos os usuários (útil para testes)
export function deleteAllUsers(): void {
  try {
    database.runSync('DELETE FROM users');
    console.log('✅ Todos os usuários foram deletados');
  } catch (error) {
    console.error('❌ Erro ao deletar usuários:', error);
    throw error;
  }
}

// ✅ Verificar se banco está vazio
export function isDatabaseEmpty(): boolean {
  return countUsers() === 0;
}