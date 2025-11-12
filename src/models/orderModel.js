const db = require("../config/db.js");

// Ambil semua order
const getAllOrders = (callback) => {
  db.query("SELECT * FROM orders", callback);
};

// Ambil order berdasarkan ID
const getOrderById = (id, callback) => {
  db.query("SELECT * FROM orders WHERE id = ?", [id], callback);
};

// Tambah order baru
const createOrder = (data, callback) => {
  const { user_id, restaurant_id, menu_item, total_price, status } = data;

  db.query(
    "INSERT INTO orders (user_id, restaurant_id, menu_item, total_price, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, restaurant_id, menu_item, total_price, status || 'pending'],
    callback
  );
};

// Update status order
const updateOrderStatus = (id, status, callback) => {
  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id], callback);
};

// Hapus order
const deleteOrder = (id, callback) => {
  db.query("DELETE FROM orders WHERE id = ?", [id], callback);
};

// ✅ Export semua function (CommonJS)
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
