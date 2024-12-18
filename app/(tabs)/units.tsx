import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Unit, unitService } from '@/services/api';

export default function UnitsScreen() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUnits = async () => {
    try {
      setIsLoading(true);
      const response = await unitService.getAll();
      setUnits(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los vehículos');
      console.error('Error loading units:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro que deseas eliminar este vehículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await unitService.delete(id);
              await loadUnits();
              Alert.alert('Éxito', 'Vehículo eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el vehículo');
              console.error('Error deleting unit:', error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadUnits();
      return () => {
        setUnits([]);
        setIsLoading(false);
      };
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Vehículos</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/units/create')}
        >
          <ThemedText style={styles.addButtonText}>+ Nuevo</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Cargando vehículos...</ThemedText>
        </ThemedView>
      ) : (
        <ScrollView 
          style={styles.tableContainer}
          horizontal={true} // Permite scroll horizontal
        >
          <ThemedView style={styles.tableContent}>
            <ThemedView style={styles.tableHeader}>
              <ThemedText style={[styles.headerCell, styles.brandCell]}>Marca</ThemedText>
              <ThemedText style={[styles.headerCell, styles.modelCell]}>Modelo</ThemedText>
              <ThemedText style={[styles.headerCell, styles.licensePlateCell]}>Matrícula</ThemedText>
              <ThemedText style={[styles.headerCell, styles.statusCell]}>Estado</ThemedText>
              <ThemedText style={[styles.headerCell, styles.actionsCell]}>Acciones</ThemedText>
            </ThemedView>

            <ScrollView>
              {units.map((unit) => (
                <ThemedView key={unit.id} style={styles.tableRow}>
                  <ThemedText numberOfLines={1} style={[styles.cell, styles.brandCell]}>{unit.brand}</ThemedText>
                  <ThemedText numberOfLines={1} style={[styles.cell, styles.modelCell]}>{unit.model}</ThemedText>
                  <ThemedText numberOfLines={1} style={[styles.cell, styles.licensePlateCell]}>{unit.licensePlate}</ThemedText>
                  <ThemedView style={[styles.cell, styles.statusCell]}>
                    <ThemedView style={[styles.badge]}>
                      <ThemedText style={styles.badgeText}>{unit.status}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={[styles.cell, styles.actionsCell]}>
                    <TouchableOpacity 
                      onPress={() => router.push(`/units/${unit.id}`)}
                      style={styles.actionButton}
                    >
                      <ThemedText style={styles.editButtonText}>Editar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(unit.id)}
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
  brandCell: {
    width: 120, // Ancho fijo para la columna marca
  },
  modelCell: {
    width: 120, // Ancho fijo para la columna modelo
  },
  licensePlateCell: {
    width: 100, // Ancho fijo para la columna matrícula
  },
  statusCell: {
    width: 120, // Ancho fijo para la columna estado
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  availableBadge: {
    backgroundColor: '#e8f5e9',
    borderColor: '#c8e6c9',
  },
  inuseBadge: {
    backgroundColor: '#fff3e0',
    borderColor: '#ffe0b2',
  },
  maintenanceBadge: {
    backgroundColor: '#ffebee',
    borderColor: '#ffcdd2',
  },
  badgeText: {
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
  },
});