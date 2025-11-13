export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string; // Tambahkan password untuk create
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}