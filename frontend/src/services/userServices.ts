import api from "./api";
import { User, CreateUserRequest, UpdateUserRequest, UpdatePasswordRequest } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data users:", error);
    throw error;
  }
};

export const getUser = async (id: number): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data user:", error);
    throw error;
  }
};

export const createUser = async (user: CreateUserRequest): Promise<User> => {
  try {
    const response = await api.post("/users", user);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal membuat user:", error);
    throw error;
  }
};

export const updateUser = async (id: number, user: UpdateUserRequest): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal memperbarui user:", error);
    throw error;
  }
};

export const updateUserPassword = async (id: number, passwordData: UpdatePasswordRequest): Promise<void> => {
  try {
    console.log('🔄 userService: Sending password update request...');
    console.log('📤 Request details:', {
      url: `/users/${id}/password`,
      method: 'PUT',
      hasToken: !!localStorage.getItem('token')
    });

    const response = await api.put(`/users/${id}/password`, passwordData);
    console.log('✅ userService: Password update response', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ userService: Password update failed');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error config:', error.response?.config);
    
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error("❌ Gagal menghapus user:", error);
    throw error;
  }
};