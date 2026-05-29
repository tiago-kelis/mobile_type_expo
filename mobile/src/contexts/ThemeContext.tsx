import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode, themes } from '../theme';

interface ThemeContextData {
  theme:      Theme;
  themeMode:  ThemeMode;
  toggleTheme: () => void;
  isDark:     boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const STORAGE_KEY = '@smartclinica:theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  // ── carregar preferência salva ─────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'dark' || saved === 'light') {
        setThemeMode(saved);
      }
    });
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme:     themes[themeMode],
        themeMode,
        toggleTheme,
        isDark:    themeMode === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  return useContext(ThemeContext);
}