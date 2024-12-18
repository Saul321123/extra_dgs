import { StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { ThemedButton } from '../../components/ThemedButton';
import { unitService, CreateUnitDto, UnitStatus } from '@/services/api';
import { Picker } from '@react-native-picker/picker';

export default function CreateUnitScreen() {
  const [formData, setFormData] = useState<CreateUnitDto>({
    brand: '',
    model: '',
    type: '',
    color: '',
    licensePlate: '',
    currentMileage: 0,
    fuelLevel: 0,
    status: UnitStatus.AVAILABLE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    brand: '',
    model: '',
    licensePlate: '',
    currentMileage: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      brand: '',
      model: '',
      licensePlate: '',
      currentMileage: '',
    };

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida';
      isValid = false;
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido';
      isValid = false;
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'La matrícula es requerida';
      isValid = false;
    }

    if (isNaN(formData.currentMileage) || formData.currentMileage < 0) {
      newErrors.currentMileage = 'El kilometraje actual debe ser un número no negativo';
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
      await unitService.create(formData);
      Alert.alert(
        'Éxito',
        'Vehículo creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      let errorMessage = 'No se pudo crear el vehículo';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
      console.error('Error creating unit:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Crear Vehículo</ThemedText>
      
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.form}>
          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Marca</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese la marca"
              autoCapitalize="words"
              value={formData.brand}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, brand: text }));
                if (errors.brand) setErrors(prev => ({ ...prev, brand: '' }));
              }}
              variant={errors.brand ? 'error' : 'default'}
            />
            {errors.brand ? <ThemedText style={styles.errorText}>{errors.brand}</ThemedText> : null}
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Modelo</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese el modelo"
              autoCapitalize="words"
              value={formData.model}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, model: text }));
                if (errors.model) setErrors(prev => ({ ...prev, model: '' }));
              }}
              variant={errors.model ? 'error' : 'default'}
            />
            {errors.model ? <ThemedText style={styles.errorText}>{errors.model}</ThemedText> : null}
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Tipo</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese el tipo"
              autoCapitalize="words"
              value={formData.type}
              onChangeText={(text) => setFormData(prev => ({ ...prev, type: text }))}
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Color</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese el color"
              autoCapitalize="words"
              value={formData.color}
              onChangeText={(text) => setFormData(prev => ({ ...prev, color: text }))}
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Matrícula</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese la matrícula"
              autoCapitalize="characters"
              value={formData.licensePlate}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, licensePlate: text }));
                if (errors.licensePlate) setErrors(prev => ({ ...prev, licensePlate: '' }));
              }}
              variant={errors.licensePlate ? 'error' : 'default'}
            />
            {errors.licensePlate ? <ThemedText style={styles.errorText}>{errors.licensePlate}</ThemedText> : null}
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Kilometraje Actual</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese el kilometraje actual"
              keyboardType="numeric"
              value={formData.currentMileage.toString()}
              onChangeText={(text) => {
                const value = parseInt(text, 10);
                setFormData(prev => ({ ...prev, currentMileage: isNaN(value) ? 0 : value }));
                if (errors.currentMileage) setErrors(prev => ({ ...prev, currentMileage: '' }));
              }}
              variant={errors.currentMileage ? 'error' : 'default'}
            />
            {errors.currentMileage ? <ThemedText style={styles.errorText}>{errors.currentMileage}</ThemedText> : null}
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Nivel de Combustible</ThemedText>
            <ThemedTextInput
              placeholder="Ingrese el nivel de combustible"
              keyboardType="numeric"
              value={formData.fuelLevel.toString()}
              onChangeText={(text) => {
                const value = parseFloat(text);
                setFormData(prev => ({ ...prev, fuelLevel: isNaN(value) ? 0 : value }));
              }}
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Estado</ThemedText>
            <Picker
              selectedValue={formData.status}
              onValueChange={(itemValue) => {
                setFormData((prev) => ({
                  ...prev,
                  status: itemValue as UnitStatus, // Convertimos a UnitStatus
                }));
              }}
              style={{ backgroundColor: 'white', borderRadius: 8, height: 50 }}
            >
              <Picker.Item label="Disponible" value={UnitStatus.AVAILABLE} />
              <Picker.Item label="Asignado" value={UnitStatus.ASSIGNED} />
              <Picker.Item label="En mantenimiento" value={UnitStatus.MAINTENANCE} />
              <Picker.Item label="Baja" value={UnitStatus.DECOMMISSIONED} />
            </Picker>
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
