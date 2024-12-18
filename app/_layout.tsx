import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="users/create" 
          options={{ 
            title: 'Crear Usuario',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="users/[id]" 
          options={{ 
            title: 'Editar Usuario',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="units/create" 
          options={{ 
            title: 'Crear Vehículo',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="units/[id]" 
          options={{ 
            title: 'Editar Vehículo',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="places/create" 
          options={{ 
            title: 'Crear Lugar',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="places/[id]" 
          options={{ 
            title: 'Editar Lugar',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
