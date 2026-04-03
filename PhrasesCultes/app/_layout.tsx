import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeToggleProvider, useThemeToggle } from '@/hooks/use-theme-toggle';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutInner() {
  const { colorScheme, isDark } = useThemeToggle();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeToggleProvider>
      <RootLayoutInner />
    </ThemeToggleProvider>
  );
}
