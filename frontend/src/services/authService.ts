import api from "./api";
import { LoginRequest, AuthResponse, User } from "../types/auth";

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    console.log('🔐 Sending login request to:', '/auth/login');
    const response = await api.post("/auth/login", credentials);
    console.log('✅ Login response received:', response.data);
    
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log('💾 Token saved to localStorage');
    } else {
      console.warn('⚠️ No token in response');
    }
    
    return response.data;
  } catch (error: any) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  
  console.log('🔍 Checking localStorage - Token:', token ? 'Exists' : 'Missing');
  console.log('🔍 Checking localStorage - User:', userStr ? 'Exists' : 'Missing');
  
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  console.log('🔐 Authentication check - Token exists:', !!token);
  return !!token;
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


export const getToken = (): string | null => {
  return localStorage.getItem("token");
};


export const verifyToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await api.get("/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.valid;
  } catch (error) {
    console.error("Token verification failed:", error);
    logout();
    return false;
  }
};