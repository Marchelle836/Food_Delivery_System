import React, { useEffect, useState } from "react";
import { getOrders, deleteOrder, updateOrderStatus } from "../services/orderService";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    fetchOrders();
  };

  const handleUpdateStatus = async (id) => {
    await updateOrderStatus(id, "delivered");
    fetchOrders();
  };

  return (
    <div>
      <h2>Daftar Pesanan</h2>
      <table border="1" cellPadding="10">
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
