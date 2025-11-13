import React, { useEffect, useState } from "react";
import { getOrders, deleteOrder, updateOrderStatus } from "../services/orderService";
import { Order } from "../types/order";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil pesanan:", error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (error) {
      console.error("Gagal menghapus pesanan:", error);
    }
  };

  const handleUpdateStatus = async (id: number): Promise<void> => {
    try {
      await updateOrderStatus(id, { status: "delivered" });
      fetchOrders();
    } catch (error) {
      console.error("Gagal mengupdate status:", error);
    }
  };

  return (
    <div>
      <h2>Daftar Pesanan</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Restoran</th>
            <th>Menu</th>
            <th>Harga</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user_id}</td>
              <td>{o.restaurant_id}</td>
              <td>{o.menu_item}</td>
              <td>{o.total_price}</td>
              <td>{o.status}</td>
              <td>
                <button onClick={() => handleUpdateStatus(o.id)}>Selesai</button>
                <button onClick={() => handleDelete(o.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;