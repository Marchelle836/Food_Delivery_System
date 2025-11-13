const db = require("../config/db.js");


const getAllOrders = (callback) => {
  db.query("SELECT * FROM orders", callback);
};


const getOrderById = (id, callback) => {
  db.query("SELECT * FROM orders WHERE id = ?", [id], callback);
};


const createOrder = (data, callback) => {
  const { user_id, restaurant_id, menu_item, total_price, status } = data;

  db.query(
    "INSERT INTO orders (user_id, restaurant_id, menu_item, total_price, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, restaurant_id, menu_item, total_price, status || 'pending'],
    callback
  );
};


const updateOrderStatus = (id, status, callback) => {
  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id], callback);
};


const deleteOrder = (id, callback) => {
  db.query("DELETE FROM orders WHERE id = ?", [id], callback);
};


module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
