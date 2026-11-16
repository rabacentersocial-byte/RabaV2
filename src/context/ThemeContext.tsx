import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'raba_theme_v2';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const preHydrated = typeof window !== 'undefined' ? (window as { __rabaInitialTheme?: string }).__rabaInitialTheme : undefined;
      if (preHydrated === 'light' || preHydrated === 'dark') {
        return preHydrated;
      }
      const saved =
        localStorage.getItem(THEME_STORAGE_KEY) ||
        localStorage.getItem('raba_theme') ||
        localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // Default is Light Mode (Warm Frosted Glass & Sand Minimalism)
      return 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const isDark = theme === 'dark';
    const bgCanvas = isDark ? '#0B0F17' : '#F5F2EC';
    const bgSecondary = isDark ? '#101522' : '#EDE9E0';
    const textPrimary = isDark ? '#F8FAFC' : '#161B26';
    const textBody = isDark ? '#94A3B8' : '#4B5563';

    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    root.style.setProperty('--bg-canvas', bgCanvas);
    root.style.setProperty('--bg-secondary', bgSecondary);
    root.style.setProperty('--text-primary', textPrimary);
    root.style.setProperty('--text-body', textBody);
    root.style.backgroundColor = bgCanvas;
    root.style.color = textPrimary;

    if (body) {
      body.style.backgroundColor = bgCanvas;
      body.style.color = textPrimary;
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem('raba_theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
