const express = require("express");
const userController = require("../controllers/userController.js");
const { authenticateToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

// GET /users - Get all users
router.get("/", authenticateToken, userController.getUsers);

// POST /users - Create new user
router.post("/", authenticateToken, userController.createUser);

// GET /users/:id - Get user by ID
router.get("/:id", authenticateToken, userController.getUser);

// PUT /users/:id - Update user
router.put("/:id", authenticateToken, userController.updateUser);

// DELETE /users/:id - Delete user
router.delete("/:id", authenticateToken, userController.deleteUser);

// PUT /users/:id/password - Update password
router.put("/:id/password", authenticateToken, userController.updatePassword);

module.exports = router;