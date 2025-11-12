const Order = require("../models/orderModel.js");
const axios = require("axios");

// URL dari service lain 
const USER_SERVICE_URL = "http://localhost:5001/users";
const RESTAURANT_SERVICE_URL = "http://localhost:5003/restaurants";

const getOrders = (req, res) => {
  Order.getAllOrders((err, results) => {
    if (err) return res.status(500).json({ message: err });
    res.json(results);
  });
};

const getOrder = (req, res) => {
  Order.getOrderById(req.params.id, async (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(404).json({ message: "Order not found" });

    const order = results[0];
    const user = await axios.get(`${USER_SERVICE_URL}/${order.user_id}`).then(r => r.data).catch(() => null);
    const restaurant = await axios.get(`${RESTAURANT_SERVICE_URL}/${order.restaurant_id}`).then(r => r.data).catch(() => null);

    res.json({ ...order, user, restaurant });
  });
};

const createOrder = (req, res) => {
  Order.createOrder(req.body, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    res.status(201).json({ message: "Order created", id: results.insertId });
  });
};

const updateStatus = (req, res) => {
  const { status } = req.body;
  Order.updateOrderStatus(req.params.id, status, (err) => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "Order status updated" });
  });
};

const deleteOrder = (req, res) => {
  Order.deleteOrder(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "Order deleted" });
  });
};

// ✅ export pakai CommonJS
module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateStatus,
  deleteOrder,
};
