import api from "./api";
import { Restaurant, CreateRestaurantRequest, UpdateRestaurantRequest } from "../types/restaurant";

export const getRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await api.get("/restaurants");
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data restaurants:", error);
    throw error;
  }
};

export const getRestaurant = async (id: number): Promise<Restaurant> => {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data restaurant:", error);
    throw error;
  }
};

export const createRestaurant = async (restaurant: CreateRestaurantRequest): Promise<Restaurant> => {
  try {
    const response = await api.post("/restaurants", restaurant);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal membuat restaurant:", error);
    throw error;
  }
};

export const updateRestaurant = async (id: number, restaurant: UpdateRestaurantRequest): Promise<Restaurant> => {
  try {
    const response = await api.put(`/restaurants/${id}`, restaurant);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal memperbarui restaurant:", error);
    throw error;
  }
};

export const deleteRestaurant = async (id: number): Promise<void> => {
  try {
    await api.delete(`/restaurants/${id}`);
  } catch (error) {
    console.error("❌ Gagal menghapus restaurant:", error);
    throw error;
  }
};