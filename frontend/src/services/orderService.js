import api from "./api";


export const getOrders = async () => {
  try {
    const response = await api.get("/orders"); 
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data orders:", error);
    throw error;
  }
};


export const createOrder = async (order) => {
  try {
    const response = await api.post("/orders", order); 
    return response.data;
  } catch (error) {
    console.error("❌ Gagal membuat order:", error);
    throw error;
  }
};


export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(`/orders/${id}/status`, { status }); 
    return response.data;
  } catch (error) {
    console.error("❌ Gagal memperbarui status order:", error);
    throw error;
  }
};


export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/${id}`); 
    return response.data;
  } catch (error) {
    console.error("❌ Gagal menghapus order:", error);
    throw error;
  }
};
