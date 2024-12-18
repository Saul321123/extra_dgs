import { StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { userService, User } from '@/services/api';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.delete(id);
              await loadUsers();
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
              console.error('Error deleting user:', error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
      return () => {
        setUsers([]);
        setIsLoading(false);
      };
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Usuarios</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/users/create')}
        >
          <ThemedText style={styles.addButtonText}>+ Nuevo</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Cargando usuarios...</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView 
          style={styles.tableContainer}
          horizontal={true} // Permite scroll horizontal
        >
          <ThemedView style={styles.tableContent}>
            <ThemedView style={styles.tableHeader}>
              <ThemedText style={[styles.headerCell, styles.nameCell]}>Nombre</ThemedText>
              <ThemedText style={[styles.headerCell, styles.emailCell]}>Email</ThemedText>
              <ThemedText style={[styles.headerCell, styles.roleCell]}>Rol</ThemedText>
              <ThemedText style={[styles.headerCell, styles.actionsCell]}>Acciones</ThemedText>
            </ThemedView>

            <ScrollView>
              {users.map((user) => (
                <ThemedView key={user.id} style={styles.tableRow}>
                  <ThemedText numberOfLines={1} style={[styles.cell, styles.nameCell]}>{user.name}</ThemedText>
                  <ThemedText numberOfLines={1} style={[styles.cell, styles.emailCell]}>{user.email}</ThemedText>
                  <ThemedView style={[styles.cell, styles.roleCell]}>
                    <ThemedView style={styles.badge}>
                      <ThemedText style={styles.badgeText}>{user.role}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={[styles.cell, styles.actionsCell]}>
                    <TouchableOpacity 
                      onPress={() => router.push(`/users/${user.id}`)}
                      style={styles.actionButton}
                    >
                      <ThemedText style={styles.editButtonText}>Editar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(user.id)}
                      style={styles.deleteButton}
                    >
                      <ThemedText style={styles.deleteButtonText}>Eliminar</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              ))}
            </ScrollView>
          </ThemedView>
        </ScrollView>
      )}
    </ThemedView>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    addButton: {
      backgroundColor: '#3498db',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tableContainer: {
      flex: 1,
    },
    tableContent: {
      minWidth: '100%',
      width: 800, // Ancho mínimo para asegurar que todo el contenido quepa
       backgroundColor: '#ffffff',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#ecf0f1',
      padding: 12,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    headerCell: {
      fontWeight: 'bold',
      color: '#34495e',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ecf0f1',
      padding: 12,
      backgroundColor: '#ffffff',
    },
    cell: {
      justifyContent: 'center',
      color: '#2c3e50',
      paddingHorizontal: 8,
      backgroundColor: '#ffffff',
    },
    nameCell: {
      width: 150, // Ancho fijo para la columna nombre
    },
    emailCell: {
      width: 200, // Ancho fijo para la columna email
    },
    roleCell: {
      width: 100, // Ancho fijo para la columna rol
      alignItems: 'center',
    },
    actionsCell: {
      width: 200, // Ancho fijo para la columna acciones
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 8,
      alignItems: 'center',
    },
    badge: {
      backgroundColor: '#e8f5e9',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#c8e6c9',
    },
    badgeText: {
      color: '#2e7d32',
      fontSize: 12,
      fontWeight: '500',
    },
    actionButton: {
      backgroundColor: '#3498db',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      minWidth: 80,
      alignItems: 'center',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      minWidth: 80,
      alignItems: 'center',
    },
    editButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    }
  });
