import { StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/ThemedButton';
import { placeService, CreatePlaceDto } from '@/services/api';

export default function CreatePlaceScreen() {
  const [formData, setFormData] = useState<CreatePlaceDto>({
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
    };

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
      await placeService.create(formData);
      Alert.alert(
        'Éxito',
        'Lugar creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      let errorMessage = 'No se pudo crear el lugar';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
      console.error('Error creating place:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Crear Lugar</ThemedText>
      
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.form}>
          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Nombre</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese el nombre"
              autoCapitalize="words"
              value={formData.name}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, name: text }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              variant={errors.name ? 'error' : 'default'}
            />
            {errors.name ? <ThemedText style={styles.errorText}>{errors.name}</ThemedText> : null}
          </ThemedView>

          <ThemedView style={styles.buttonsContainer}>
        <ThemedButton 
          onPress={() => router.back()}
          title="Cancelar"
          variant="secondary"
          disabled={isLoading}
        />
        <ThemedButton 
          onPress={handleSubmit}
          title={isLoading ? "Guardando..." : "Guardar"}
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
});