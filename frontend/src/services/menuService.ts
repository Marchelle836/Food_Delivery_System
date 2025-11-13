import api from "./api";
import { Menu, CreateMenuRequest, UpdateMenuRequest } from "../types/menu";

export const getMenusByRestaurant = async (restaurantId: string): Promise<Menu[]> => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}/menus`);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data menu:", error);
    throw error;
  }
};

export const createMenu = async (restaurantId: string, menu: CreateMenuRequest): Promise<Menu> => {
  try {
    const response = await api.post(`/restaurants/${restaurantId}/menus`, menu);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal membuat menu:", error);
    throw error;
  }
};

export const updateMenu = async (restaurantId: string, id: number, menu: UpdateMenuRequest): Promise<Menu> => {
  try {
    const response = await api.put(`/restaurants/${restaurantId}/menus/${id}`, menu);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal memperbarui menu:", error);
    throw error;
  }
};

export const deleteMenu = async (restaurantId: string, id: number): Promise<void> => {
  try {
    await api.delete(`/restaurants/${restaurantId}/menus/${id}`);
  } catch (error) {
    console.error("❌ Gagal menghapus menu:", error);
    throw error;
  }
};