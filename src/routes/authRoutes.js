const express = require("express");
const {
  login,
  register,
  verifyToken,
  getProfile,
  updateProfile,
} = require("../controllers/authController.js");
const { authenticateToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);
router.get("/verify", verifyToken);

// Protected routes (memerlukan token)
// router.get("/profile", authenticateToken, getProfile);
// router.put("/profile", authenticateToken, updateProfile);

module.exports = router;