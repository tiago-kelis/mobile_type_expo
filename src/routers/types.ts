export type RootStackParamList = {
  Login: undefined;
  User: undefined;
  Home: {
    user: {
      id: number;
      name: string;
      email: string;
      created_at?: string;
      // ✅ Sem password!
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}