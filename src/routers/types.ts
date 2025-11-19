// ✅ Tipo reutilizável para o usuário COM role
export type UserData = {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin'; // ✅ NOVA propriedade
  created_at?: string;
};

// ✅ Definição de todas as rotas e seus parâmetros
export type RootStackParamList = {
  // Login não recebe parâmetros
  Login: undefined;
  
  // Dashboard recebe os dados do usuário logado
  Dashboard: {
    user: UserData;
  };
  
  // ✅ NOVA rota - AdminDashboard recebe os dados do usuário admin
  AdminDashboard: {
    user: UserData;
  };
  
  // Home recebe os dados do usuário logado
  Home: {
    user: UserData;
  };

  // ✅ NOVA ROTA: Appointments recebe os dados do usuário
  Appointments: {
    user: UserData;
  };
  
  // User pode receber dados do usuário para edição (opcional)
  // Se não receber, é modo de criação de conta
  User: {
    user?: UserData;
  } | undefined;
};

// Declaração global para melhor autocomplete no TypeScript
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}