import api from "./api";
import { Order, CreateOrderRequest, UpdateOrderStatusRequest } from "../types/order";

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data orders:", error);
    throw error;
  }
};

export const createOrder = async (order: CreateOrderRequest): Promise<Order> => {
  try {
    const response = await api.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal membuat order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: UpdateOrderStatusRequest): Promise<Order> => {
  try {
    const response = await api.put(`/orders/${id}/status`, status);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal memperbarui status order:", error);
    throw error;
  }
};

export const deleteOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/orders/${id}`);
  } catch (error) {
    console.error("❌ Gagal menghapus order:", error);
    throw error;
  }
};