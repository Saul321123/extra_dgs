import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { userService, User, UpdateUserDto, Role } from '@/services/api';

import { Picker } from '@react-native-picker/picker';

export default function EditUserScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({
    name: '',
    email: '',
    role: Role.DRIVER,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getById(Number(id));
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del usuario');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'El nombre y email son requeridos');
      return;
    }

    try {
      setIsLoading(true);
      await userService.update(Number(id), formData);
      Alert.alert('Éxito', 'Usuario actualizado correctamente', [
        { 
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el usuario');
      console.error('Error updating user:', error);
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

  if (isLoading || !user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Editar Usuario</ThemedText>
      
      <ThemedView style={styles.form}>
        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Nombre</ThemedText>
          <ThemedTextInput
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Ingrese el nombre"
            autoCapitalize="words"
          />
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedTextInput
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="Ingrese el email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Nueva Contraseña (opcional)</ThemedText>
          <ThemedTextInput
            value={formData.password || ''}
            onChangeText={(text) => {
              if (text) {
                setFormData(prev => ({ ...prev, password: text }));
              } else {
                const { password, ...rest } = formData;
                setFormData(rest);
              }
            }}
            placeholder="Dejar en blanco para mantener la actual"
            secureTextEntry
          />
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText type="defaultSemiBold">Rol</ThemedText>
          <Picker
            selectedValue={formData.role}
            onValueChange={(itemValue) =>
              setFormData((prev) => ({
                ...prev,
                role: itemValue as Role, // Convertimos a Role
              }))
            }
            style={{ backgroundColor: 'white', borderRadius: 8, height: 50 }}
          >
            <Picker.Item label="ADMIN" value={Role.ADMIN} />
            <Picker.Item label="DRIVER" value={Role.DRIVER} />
          </Picker>
        </ThemedView>

        <ThemedView style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2c3e50',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  }
});