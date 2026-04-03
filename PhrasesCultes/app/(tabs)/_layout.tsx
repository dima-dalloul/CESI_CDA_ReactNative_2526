import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // À décommenter si on ne veut pas voir les titres : tabBarShowLabel: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="wand.and.stars" color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'À propos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="group" color={color} />,
        }}
      />
    </Tabs>
  );
}
