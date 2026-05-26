import database from './index';
import { createUser, emailExists, verifyAdminExists } from './services/userServices';

interface AdminConfig {
  name: string;
  email: string;
  password: string;
}

const DEFAULT_ADMIN: AdminConfig = {
  name:     'Administrador',
  email:    'adm01@gmail.com',
  password: 'Admin123',
};

// ── Resultado tipado ──────────────────────────────────────────────────────────
type SeedResult =
  | { status: 'already_exists'; message: string }
  | { status: 'created';        message: string; id: number }
  | { status: 'error';          message: string };

// ── Função principal ──────────────────────────────────────────────────────────
export function seedAdmin(config: AdminConfig = DEFAULT_ADMIN): SeedResult {
  try {
    console.log('🌱 Verificando admin...');

    // ✅ 1. Verificar se já existe algum admin pelo role
    const adminAlreadyExists = verifyAdminExists();
    if (adminAlreadyExists) {
      console.log('✅ Admin já existe — seed ignorado');
      return {
        status: 'already_exists',
        message: 'Admin já cadastrado no banco',
      };
    }

    // ✅ 2. Verificar se o email específico já está em uso (por não-admin)
    const emailJaUsado = emailExists(config.email);
    if (emailJaUsado) {
      console.log(`🔄 Email ${config.email} existe mas não é admin — promovendo...`);

      database.runSync(
        "UPDATE users SET role = 'admin', updated_at = datetime('now') WHERE email = ?",
        [config.email]
      );

      console.log(`✅ ${config.email} promovido para admin`);
      return {
        status: 'already_exists',
        message: `${config.email} promovido para admin`,
      };
    }

    // ✅ 3. Criar o admin do zero
    console.log(`🆕 Criando admin: ${config.email}`);

    const userId = createUser(
      config.name,
      config.email,
      config.password,
      'admin'
    );

    console.log('✅ Admin criado com sucesso!');
    console.log(`   📧 Email: ${config.email}`);
    console.log(`   🔑 Senha: ${config.password}`);
    console.log(`   🆔 ID:    ${userId}`);

    return {
      status: 'created',
      message: `Admin criado: ${config.email}`,
      id: userId,
    };

  } catch (error: any) {
    console.error('❌ Erro ao criar admin:', error);
    return {
      status: 'error',
      message: error.message || 'Erro desconhecido',
    };
  }
}