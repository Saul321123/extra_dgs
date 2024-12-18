import { StyleSheet, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/ThemedButton';
import { placeService, UpdatePlaceDto, Place } from '@/services/api';

export default function EditPlaceScreen() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState<UpdatePlaceDto>({ name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '' });
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        setIsLoading(true);
        const response = await placeService.getById(Number(id));
        setPlace(response.data);
        setFormData({ name: response.data.name });
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del lugar');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadPlace();
  }, [id]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor, completa todos los campos correctamente');
      return;
    }

    try {
      setIsLoading(true);
      await placeService.update(Number(id), formData);
      Alert.alert(
        'Éxito',
        'Lugar actualizado correctamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      let errorMessage = 'No se pudo actualizar el lugar';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
      console.error('Error updating place:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro que deseas cancelar? Los cambios no guardados se perderán.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', onPress: () => router.back() }
      ]
    );
  };

  if (isLoading || !place) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Editar Lugar</ThemedText>

      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.form}>
          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Nombre</ThemedText>
            <ThemedTextInput
              value={formData.name}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, name: text }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Ingrese el nombre"
              autoCapitalize="words"
              variant={errors.name ? 'error' : 'default'}
            />
            {errors.name ? <ThemedText style={styles.errorText}>{errors.name}</ThemedText> : null}
          </ThemedView>

          <ThemedView style={styles.buttonsContainer}>
            <ThemedButton
              title="Cancelar"
              onPress={handleCancel}
              variant="secondary"
              disabled={isLoading}
            />
            <ThemedButton
              title={isLoading ? 'Guardando...' : 'Guardar'}
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  form: {
    gap: 16,
    marginBottom: 100,
  },
  field: {
    gap: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
