import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

interface ThemeToggleContextType {
  colorScheme: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeToggleContext = createContext<ThemeToggleContextType>({
  colorScheme: 'light',
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeToggleProvider({ children }: PropsWithChildren) {
  const systemScheme = useSystemColorScheme();
  const [override, setOverride] = useState<ColorScheme>(systemScheme ?? 'light');

  const toggleTheme = () => setOverride((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeToggleContext.Provider value={{ colorScheme: override, isDark: override === 'dark', toggleTheme }}>
      {children}
    </ThemeToggleContext.Provider>
  );
}

export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}
