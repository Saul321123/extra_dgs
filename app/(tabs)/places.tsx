import { StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { placeService, Place } from '@/services/api';

export default function PlacesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlaces = async () => {
    try {
      setIsLoading(true);
      const response = await placeService.getAll();
      setPlaces(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los lugares');
      console.error('Error loading places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este lugar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await placeService.delete(id);
              await loadPlaces();
              Alert.alert('Éxito', 'Lugar eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el lugar');
              console.error('Error deleting place:', error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
      return () => {
        setPlaces([]);
        setIsLoading(false);
      };
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Lugares</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/places/create')}
        >
          <ThemedText style={styles.addButtonText}>+ Nuevo</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Cargando lugares...</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView 
          style={styles.tableContainer}
          horizontal={true} // Permite scroll horizontal
        >
          <ThemedView style={styles.tableContent}>
            <ThemedView style={styles.tableHeader}>
              <ThemedText style={[styles.headerCell, styles.nameCell]}>Nombre</ThemedText>
              <ThemedText style={[styles.headerCell, styles.actionsCell]}>Acciones</ThemedText>
            </ThemedView>

            <ScrollView>
              {places.map((place) => (
                <ThemedView key={place.id} style={styles.tableRow}>
                  <ThemedText numberOfLines={1} style={[styles.cell, styles.nameCell]}>{place.name}</ThemedText>
                  <ThemedView style={[styles.cell, styles.actionsCell]}>
                    <TouchableOpacity 
                      onPress={() => router.push(`/places/${place.id}`)}
                      style={styles.actionButton}
                    >
                      <ThemedText style={styles.editButtonText}>Editar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(place.id)}
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
    width: 600, // Ancho mínimo para asegurar que todo el contenido quepa
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
    width: 300, // Ancho fijo para la columna nombre
  },
  actionsCell: {
    width: 200, // Ancho fijo para la columna acciones
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    alignItems: 'center',
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
  },
});