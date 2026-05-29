import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id:         number;
  name:       string;
  email:      string;
  role:       'user' | 'admin' | 'professional';
  created_at?: string;
}

interface AuthContextData {
  user:       AuthUser | null;
  token:      string | null;
  isLoading:  boolean;
  signIn:     (user: AuthUser, token: string) => Promise<void>;
  signOut:    () => Promise<void>;
  isAdmin:    boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const USER_KEY  = '@smartclinica:user';
const TOKEN_KEY = '@smartclinica:token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── restaurar sessão ───────────────────────────────────────────────────────
  useEffect(() => {
    async function restore() {
      try {
        const [savedUser, savedToken] = await Promise.all([
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(TOKEN_KEY),
        ]);

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    }
    restore();
  }, []);

  const signIn = async (userData: AuthUser, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    await Promise.all([
      AsyncStorage.setItem(USER_KEY,  JSON.stringify(userData)),
      AsyncStorage.setItem(TOKEN_KEY, userToken),
    ]);
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await Promise.all([
      AsyncStorage.removeItem(USER_KEY),
      AsyncStorage.removeItem(TOKEN_KEY),
    ]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signOut,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}