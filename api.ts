// services/api.ts

import axios from 'axios';
import { ApiResponse, User, Unit, Place, UserFormData, UnitFormData, PlaceFormData } from './types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const usersApi = {
  getAll: () => api.get<ApiResponse<User[]>>('/users'),
  getById: (id: number) => api.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: UserFormData) => api.post<ApiResponse<User>>('/users', data),
  update: (id: number, data: UserFormData) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/users/${id}`),
};

// Units API
export const unitsApi = {
  getAll: () => api.get<ApiResponse<Unit[]>>('/units'),
  getById: (id: number) => api.get<ApiResponse<Unit>>(`/units/${id}`),
  create: (data: UnitFormData) => api.post<ApiResponse<Unit>>('/units', data),
  update: (id: number, data: UnitFormData) => api.put<ApiResponse<Unit>>(`/units/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/units/${id}`),
};

// Places API
export const placesApi = {
  getAll: () => api.get<ApiResponse<Place[]>>('/places'),
  getById: (id: number) => api.get<ApiResponse<Place>>(`/places/${id}`),
  create: (data: PlaceFormData) => api.post<ApiResponse<Place>>('/places', data),
  update: (id: number, data: PlaceFormData) => api.put<ApiResponse<Place>>(`/places/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/places/${id}`),
};



export default api;