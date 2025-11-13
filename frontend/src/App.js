import React, { useEffect, useState } from "react";
import {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
} from "./services/orderService";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    menu_item: "",
    total_price: "",
    status: "pending",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      await createOrder(newOrder);
      setNewOrder({ menu_item: "", total_price: "", status: "pending" });
      fetchOrders();
    } catch (err) {
      console.error("Gagal tambah order:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin hapus pesanan ini?")) {
      await deleteOrder(id);
      fetchOrders();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  return (
    <div className="container">
      <h1>📦 Daftar Pesanan</h1>

      {/* Form Tambah Pesanan */}
      <form className="order-form" onSubmit={handleAddOrder}>
        <input
          type="text"
          placeholder="Nama Menu"
          value={newOrder.menu_item}
          onChange={(e) =>
            setNewOrder({ ...newOrder, menu_item: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Total Harga"
          value={newOrder.total_price}
          onChange={(e) =>
            setNewOrder({ ...newOrder, total_price: e.target.value })
          }
          required
        />
        <button type="submit">Tambah Pesanan</button>
      </form>

      {/* Tabel Daftar Pesanan */}
      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Menu</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.menu_item}</td>
                <td>Rp {Number(order.total_price).toLocaleString()}</td>
                <td>
                  <select
                    className={`status-select ${order.status}`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(order.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty">
                Belum ada pesanan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
