import { StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { ThemedButton } from '../../components/ThemedButton';
import { userService, CreateUserDto, Role } from '@/services/api';

import { Picker } from '@react-native-picker/picker';

export default function CreateUserScreen() {
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    password: '',
    role: Role.DRIVER, // Usamos el enum
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
      await userService.create(formData);
      Alert.alert(
        'Éxito',
        'Usuario creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      let errorMessage = 'No se pudo crear el usuario';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
      console.error('Error creating user:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (text: string) => {
    const upperText = text.toUpperCase();
    if (upperText === 'ADMIN' || upperText === 'DRIVER') {
      setFormData(prev => ({
        ...prev,
        role: upperText as Role
      }));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Crear Usuario</ThemedText>
      
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

        <ThemedView style={styles.field}>
          <ThemedText type="defaultSemiBold">Email</ThemedText>
          <ThemedTextInput
            placeholder="Ingrese el email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, email: text }));
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            variant={errors.email ? 'error' : 'default'}
          />
          {errors.email ? <ThemedText style={styles.errorText}>{errors.email}</ThemedText> : null}
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText type="defaultSemiBold">Contraseña</ThemedText>
          <ThemedTextInput
            placeholder="Ingrese la contraseña (mínimo 6 caracteres)"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, password: text }));
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            variant={errors.password ? 'error' : 'default'}
          />
          {errors.password ? <ThemedText style={styles.errorText}>{errors.password}</ThemedText> : null}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
  },
});