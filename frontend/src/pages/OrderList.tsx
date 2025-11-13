import React, { useEffect, useState } from "react";
import {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
} from "../services/orderService";
import { getRestaurants } from "../services/restaurantService";
import { getMenusByRestaurant } from "../services/menuService";
import { Order, CreateOrderRequest, UpdateOrderStatusRequest } from "../types/order";
import { Restaurant } from "../types/restaurant";
import { Menu } from "../types/menu";
import "../App.css";

interface CartItem {
  menu_id: number;
  menu_name: string;
  price: number;
  quantity: number;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchMenus(selectedRestaurantId);
    } else {
      setMenus([]);
    }
  }, [selectedRestaurantId]);

  const fetchOrders = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Gagal ambil data order:", err);
      alert("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async (): Promise<void> => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error("Gagal ambil data restoran:", err);
      alert("Gagal mengambil data restoran");
    }
  };

  const fetchMenus = async (restaurantId: string): Promise<void> => {
    try {
      const data = await getMenusByRestaurant(restaurantId);
      setMenus(data);
      setSelectedMenuId(""); // Reset selected menu ketika ganti restaurant
    } catch (err) {
      console.error("Gagal ambil data menu:", err);
      alert("Gagal mengambil data menu");
      setMenus([]);
    }
  };

  const handleAddToCart = (): void => {
    if (!selectedMenuId) {
      alert("Pilih menu terlebih dahulu");
      return;
    }

    const selectedMenu = menus.find(menu => menu.id === parseInt(selectedMenuId));
    if (!selectedMenu) return;

    const existingCartItem = cart.find(item => item.menu_id === selectedMenu.id);

    if (existingCartItem) {
      // Update quantity jika menu sudah ada di cart
      setCart(cart.map(item =>
        item.menu_id === selectedMenu.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Tambah menu baru ke cart
      setCart([
        ...cart,
        {
          menu_id: selectedMenu.id,
          menu_name: selectedMenu.name,
          price: parseFloat(selectedMenu.price),
          quantity: 1
        }
      ]);
    }

    setSelectedMenuId(""); // Reset selected menu setelah ditambahkan
  };

  const handleRemoveFromCart = (menuId: number): void => {
    setCart(cart.filter(item => item.menu_id !== menuId));
  };

  const handleUpdateQuantity = (menuId: number, newQuantity: number): void => {
    if (newQuantity < 1) {
      handleRemoveFromCart(menuId);
      return;
    }

    setCart(cart.map(item =>
      item.menu_id === menuId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleCheckout = async (): Promise<void> => {
    if (cart.length === 0) {
      alert("Keranjang belanja kosong");
      return;
    }

    if (!selectedRestaurantId) {
      alert("Pilih restoran terlebih dahulu");
      return;
    }

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const menuItems = cart.map(item => `${item.menu_name} (${item.quantity}x)`).join(", ");

    try {
      const orderData: CreateOrderRequest = {
        menu_item: menuItems,
        total_price: totalPrice.toString(),
        status: "pending",
        restaurant_id: parseInt(selectedRestaurantId),
        user_id: 1 // Default user ID, bisa diganti dengan user yang login
      };

      await createOrder(orderData);
      alert("Pesanan berhasil dibuat!");
      setCart([]);
      setSelectedRestaurantId("");
      setSelectedMenuId("");
      fetchOrders();
    } catch (err) {
      console.error("Gagal membuat pesanan:", err);
      alert("Gagal membuat pesanan");
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm("Yakin ingin menghapus pesanan ini?")) {
      try {
        await deleteOrder(id);
        fetchOrders();
        alert("Pesanan berhasil dihapus");
      } catch (err) {
        console.error("Gagal hapus order:", err);
        alert("Gagal menghapus pesanan");
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: Order['status']): Promise<void> => {
    try {
      const statusUpdate: UpdateOrderStatusRequest = { status: newStatus };
      await updateOrderStatus(id, statusUpdate);
      fetchOrders();
      alert("Status pesanan berhasil diupdate");
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal mengupdate status pesanan");
    }
  };

  const getTotalCartPrice = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Agregat orders by order ID (jika ada multiple items per order)
  const aggregatedOrders = orders.reduce((acc, order) => {
    if (!acc[order.id]) {
      acc[order.id] = {
        ...order,
        total_price: parseFloat(order.total_price)
      };
    }
    return acc;
  }, {} as { [key: number]: Order & { total_price: number } });

  return (
    <div className="container">
      <h1>📦 Daftar Pesanan</h1>

      {/* Section Buat Pesanan Baru */}
      <div className="order-creation-section">
        <h2>Buat Pesanan Baru</h2>
        
        {/* Pilih Restoran */}
        <div className="form-group">
          <label htmlFor="restaurant-select">Pilih Restoran:</label>
          <select
            id="restaurant-select"
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            className="form-select"
          >
            <option value="">-- Pilih Restoran --</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name} - {restaurant.location}
              </option>
            ))}
          </select>
        </div>

        {/* Pilih Menu */}
        {selectedRestaurantId && (
          <div className="form-group">
            <label htmlFor="menu-select">Pilih Menu:</label>
            <select
              id="menu-select"
              value={selectedMenuId}
              onChange={(e) => setSelectedMenuId(e.target.value)}
              className="form-select"
            >
              <option value="">-- Pilih Menu --</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name} - Rp {Number(menu.price).toLocaleString('id-ID')}
                </option>
              ))}
            </select>
            <button 
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ marginTop: '10px' }}
            >
              + Tambah ke Keranjang
            </button>
          </div>
        )}

        {/* Keranjang Belanja */}
        {cart.length > 0 && (
          <div className="cart-section">
            <h3>Keranjang Belanja</h3>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Menu</th>
                  <th>Harga</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.menu_id}>
                    <td>{item.menu_name}</td>
                    <td>Rp {item.price.toLocaleString('id-ID')}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.menu_id, parseInt(e.target.value) || 1)}
                        min="1"
                        className="quantity-input"
                      />
                    </td>
                    <td>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveFromCart(item.menu_id)}
                        className="btn-delete"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}><strong>Total:</strong></td>
                  <td colSpan={2}>
                    <strong>Rp {getTotalCartPrice().toLocaleString('id-ID')}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
            <button 
              onClick={handleCheckout}
              className="btn-checkout"
            >
              💳 Checkout Pesanan
            </button>
          </div>
        )}
      </div>

      {/* Daftar Pesanan */}
      <div className="orders-section">
        <h2>Daftar Semua Pesanan</h2>
        
        {loading ? (
          <div className="loading">Memuat data pesanan...</div>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Restoran</th>
                <th>Menu</th>
                <th>Total Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(aggregatedOrders).length > 0 ? (
                Object.values(aggregatedOrders).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>Restoran {order.restaurant_id}</td>
                    <td>{order.menu_item}</td>
                    <td>Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                    <td>
                      <select
                        className={`status-select ${order.status}`}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as Order['status'])
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
                  <td colSpan={6} className="empty">
                    Belum ada pesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderList;