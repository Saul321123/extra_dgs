// types.ts

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  
  export interface Unit {
    id: number;
    model: string;
    brand: string;
    year: number;
    plate: string;
    status: string;
  }
  
  export interface Place {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
  }
  


  // API Response types
  export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
  }
  
  // Form Types
  export type UserFormData = Omit<User, 'id'>;
  export type UnitFormData = Omit<Unit, 'id'>;
  export type PlaceFormData = Omit<Place, 'id'>;