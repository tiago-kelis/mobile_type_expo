import { AuthUser } from '../contexts/AuthContext';

// ── Re-export para compatibilidade ────────────────────────────────────────────
export type UserData = AuthUser;

// ── Rotas e parâmetros ────────────────────────────────────────────────────────
export type RootStackParamList = {
  // sem parâmetros — tela inicial
  Login: undefined;

  // usuário comum após login
  Dashboard: {
    user: UserData;
  };

  // administrador após login
  AdminDashboard: {
    user: UserData;
  };


   ProfessionalDashboard:{ user: UserData }; // ✅ novo

  // detalhes do usuário logado
  Home: {
    user: UserData;
  };

  // agendamentos do usuário
  Appointments: {
    user: UserData;
  };

  // ✅ NOVAS rotas admin
  AdminServices:      undefined;
  AdminProfessionals: undefined;

  // criação de conta (sem user) ou edição de perfil (com user)
  User: {
    user?: UserData;
  } | undefined;
};

// ── Autocomplete global do TypeScript ─────────────────────────────────────────
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

