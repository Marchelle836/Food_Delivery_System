const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "your-secret-key-change-in-production" } = process.env;

// Generate JWT Token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Login user
const login = (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Email dan password harus diisi" 
    });
  }

  // Cari user by email
  User.getByEmail(email, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ 
        success: false,
        message: "Terjadi kesalahan server" 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: "Email atau password salah" 
      });
    }

    const user = results[0];

    // Verify password
    User.verifyPassword(password, user.password, (err, isValid) => {
      if (err) {
        console.error("Password verification error:", err);
        return res.status(500).json({ 
          success: false,
          message: "Terjadi kesalahan server" 
        });
      }

      if (!isValid) {
        return res.status(401).json({ 
          success: false,
          message: "Email atau password salah" 
        });
      }

      // Generate token
      const token = generateToken(user.id, user.email);

      // Remove password from user data
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: "Login berhasil",
        user: userWithoutPassword,
        token
      });
    });
  });
};

// Register user baru
const register = (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Validasi input
  if (!name || !email || !password || !phone || !address) {
    return res.status(400).json({ 
      success: false,
      message: "Semua field harus diisi" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: "Password minimal 6 karakter" 
    });
  }

  // Cek apakah email sudah terdaftar
  User.getByEmail(email, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ 
        success: false,
        message: "Terjadi kesalahan server" 
      });
    }

    if (results.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: "Email sudah terdaftar" 
      });
    }

    // Buat user baru
    User.create(req.body, (err, result) => {
      if (err) {
        console.error("Create user error:", err);
        return res.status(500).json({ 
          success: false,
          message: "Gagal membuat user" 
        });
      }

      // Ambil user data tanpa password
      User.getById(result.insertId, (err, userResults) => {
        if (err || userResults.length === 0) {
          return res.status(500).json({ 
            success: false,
            message: "User berhasil dibuat tetapi gagal mengambil data" 
          });
        }

        const newUser = userResults[0];
        const token = generateToken(newUser.id, newUser.email);

        res.status(201).json({
          success: true,
          message: "User berhasil dibuat",
          user: newUser,
          token
        });
      });
    });
  });
};

// Verify token
const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ 
      success: false,
      valid: false 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Cek apakah user masih ada di database
    User.getById(decoded.userId, (err, results) => {
      if (err || results.length === 0) {
        return res.json({ 
          success: false,
          valid: false 
        });
      }

      res.json({
        success: true,
        valid: true,
        user: results[0]
      });
    });
  } catch (error) {
    res.json({ 
      success: false,
      valid: false 
    });
  }
};

// Get current user profile
const getProfile = (req, res) => {
  // req.userId di-set dari middleware auth
  const userId = req.userId;

  User.getById(userId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "User tidak ditemukan" 
      });
    }

    res.json({
      success: true,
      user: results[0]
    });
  });
};

// Update user profile
const updateProfile = (req, res) => {
  const userId = req.userId;
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    return res.status(400).json({ 
      success: false,
      message: "Semua field harus diisi" 
    });
  }

  // Cek jika email sudah digunakan oleh user lain
  User.getByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: "Terjadi kesalahan server" 
      });
    }

    const existingUser = results.find(user => user.id !== userId);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email sudah digunakan oleh user lain" 
      });
    }

    // Update profile
    User.update(userId, req.body, (err) => {
      if (err) {
        return res.status(500).json({ 
          success: false,
          message: "Gagal mengupdate profile" 
        });
      }

      // Get updated user data
      User.getById(userId, (err, updatedResults) => {
        if (err || updatedResults.length === 0) {
          return res.status(500).json({ 
            success: false,
            message: "Profile berhasil diupdate tetapi gagal mengambil data" 
          });
        }

        res.json({
          success: true,
          message: "Profile berhasil diupdate",
          user: updatedResults[0]
        });
      });
    });
  });
};

module.exports = {
  login,
  register,
  verifyToken,
  getProfile,
  updateProfile,
};