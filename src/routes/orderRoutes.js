const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  updateStatus,
  deleteOrder,
} = require("../controllers/orderController.js");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id/status", updateStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
