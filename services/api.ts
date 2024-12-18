import axios from 'axios';

// Enum que coincide con Prisma
export enum Role {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER'
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

// DTO para crear usuarios (requiere todos los campos)
export type CreateUserDto = Omit<User, 'id'>;

// DTO para actualizar usuarios (password opcional)
export type UpdateUserDto = Omit<User, 'id' | 'password'> & {
  password?: string;
};

const api = axios.create({
  baseURL: 'http://192.168.1.64:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => api.post<User>('/users', data),
  update: (id: number, data: UpdateUserDto) => api.put<User>(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};


export enum UnitStatus {
  AVAILABLE = 'AVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
  ASSIGNED = 'ASSIGNED',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export interface Unit {
  id: number;
  brand: string;
  model: string;
  type: string;
  color: string;
  licensePlate: string;
  currentMileage: number;
  lastMaintenanceDate?: Date;
  lastMaintenanceMileage?: number;
  fuelLevel?: number;
  status: UnitStatus;
}

export type CreateUnitDto = Omit<Unit, 'id'>;

export type UpdateUnitDto = Partial<CreateUnitDto>;

export const unitService = {
  getAll: () => api.get<Unit[]>('/units'),
  getById: (id: number) => api.get<Unit>(`/units/${id}`),
  create: (data: CreateUnitDto) => api.post<Unit>('/units', data),
  update: (id: number, data: UpdateUnitDto) => api.put<Unit>(`/units/${id}`, data),
  delete: (id: number) => api.delete(`/units/${id}`),
};


export interface Place {
  id: number;
  name: string;
}

// DTO para crear un lugar
export type CreatePlaceDto = Omit<Place, 'id'>;

// DTO para actualizar un lugar
export type UpdatePlaceDto = Partial<CreatePlaceDto>;

export const placeService = {
  getAll: () => api.get<Place[]>('/places'),
  getById: (id: number) => api.get<Place>(`/places/${id}`),
  create: (data: CreatePlaceDto) => api.post<Place>('/places', data),
  update: (id: number, data: UpdatePlaceDto) => api.put<Place>(`/places/${id}`, data),
  delete: (id: number) => api.delete(`/places/${id}`),
};


export default api;