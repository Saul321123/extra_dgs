import { StyleSheet, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedButton } from '@/components/ThemedButton';
import { unitService, Unit, UpdateUnitDto, UnitStatus } from '@/services/api';
import { Picker } from '@react-native-picker/picker';

export default function EditUnitScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState<UpdateUnitDto>({
    brand: '',
    model: '',
    type: '',
    color: '',
    licensePlate: '',
    currentMileage: 0,
    fuelLevel: 0,
    status: UnitStatus.AVAILABLE,
  });

  useEffect(() => {
    const loadUnit = async () => {
      try {
        setIsLoading(true);
        const response = await unitService.getById(Number(id));
        setUnit(response.data);
        setFormData({
          brand: response.data.brand,
          model: response.data.model,
          type: response.data.type,
          color: response.data.color,
          licensePlate: response.data.licensePlate,
          currentMileage: response.data.currentMileage,
          fuelLevel: response.data.fuelLevel ?? 0,
          status: response.data.status,
        });
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del vehículo');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadUnit();
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.brand || !formData.model || !formData.licensePlate) {
      Alert.alert('Error', 'La marca, modelo y matrícula son requeridos');
      return;
    }

    try {
      setIsLoading(true);
      await unitService.update(Number(id), formData);
      Alert.alert('Éxito', 'Vehículo actualizado correctamente', [
        { 
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el vehículo');
      console.error('Error updating unit:', error);
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

  if (isLoading || !unit) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Editar Vehículo</ThemedText>
      
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.form}>
          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Marca</ThemedText>
            <ThemedTextInput
              value={formData.brand}
              onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
              placeholder="Ingrese la marca"
              autoCapitalize="words"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Modelo</ThemedText>
            <ThemedTextInput
              value={formData.model}
              onChangeText={(text) => setFormData(prev => ({ ...prev, model: text }))}
              placeholder="Ingrese el modelo"
              autoCapitalize="words"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Tipo</ThemedText>
            <ThemedTextInput
              value={formData.type}
              onChangeText={(text) => setFormData(prev => ({ ...prev, type: text }))}
              placeholder="Ingrese el tipo"
              autoCapitalize="words"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Color</ThemedText>
            <ThemedTextInput
              value={formData.color}
              onChangeText={(text) => setFormData(prev => ({ ...prev, color: text }))}
              placeholder="Ingrese el color"
              autoCapitalize="words"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Matrícula</ThemedText>
            <ThemedTextInput
              value={formData.licensePlate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, licensePlate: text }))}
              placeholder="Ingrese la matrícula"
              autoCapitalize="characters"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Kilometraje Actual</ThemedText>
            <ThemedTextInput
              value={formData.currentMileage.toString()}
              onChangeText={(text) => {
                const value = parseInt(text, 10);
                setFormData(prev => ({ ...prev, currentMileage: isNaN(value) ? 0 : value }))
              }}
              placeholder="Ingrese el kilometraje actual"
              keyboardType="numeric"
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedText type="defaultSemiBold">Nivel de Combustible</ThemedText>
            <ThemedTextInput
              value={formData.fuelLevel.toString()}
              onChangeText={(text) => {
                const value = parseFloat(text);
                setFormData(prev => ({ ...prev, fuelLevel: isNaN(value) ? 0 : value }))
              }}
              placeholder="Ingrese el nivel de combustible"
              keyboardType="numeric"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});