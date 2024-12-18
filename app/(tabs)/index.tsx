import { Image, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sistema de Gestión</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Usuarios</ThemedText>
        <ThemedText>
          Gestiona los usuarios del sistema. Puedes ver, crear, editar y eliminar usuarios.
        </ThemedText>
        <Link href="./users" style={styles.link}>
          <ThemedText type="defaultSemiBold">Ir a Usuarios →</ThemedText>
        </Link>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Vehículos</ThemedText>
        <ThemedText>
          Administra la flota de vehículos. Registra nuevas unidades, actualiza su información y gestiona su estado.
        </ThemedText>
        <Link href="./units" style={styles.link}>
          <ThemedText type="defaultSemiBold">Ir a Vehículos →</ThemedText>
        </Link>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Lugares</ThemedText>
        <ThemedText>
          Gestiona los lugares y ubicaciones relevantes para la operación de los vehículos.
        </ThemedText>
        <Link href="./places" style={styles.link}>
          <ThemedText type="defaultSemiBold">Ir a Lugares →</ThemedText>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  link: {
    marginTop: 8,
  },
});
