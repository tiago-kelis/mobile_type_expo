// ── Tipo reutilizável do usuário ──────────────────────────────────────────────
export type UserData = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
};

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

  // detalhes do usuário logado
  Home: {
    user: UserData;
  };

  // agendamentos do usuário
  Appointments: {
    user: UserData;
  };

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