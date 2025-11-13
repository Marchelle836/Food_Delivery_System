const User = require("../models/userModel.js");

// GET semua users
const getUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ message: err });
    res.json(results);
  });
};

// GET satu user berdasarkan ID
const getUser = (req, res) => {
  User.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
};

// POST tambah user baru
const createUser = (req, res) => {
  const { name, email, phone, address } = req.body;

  // Validasi input
  if (!name || !email || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Cek apakah email sudah terdaftar
  User.getByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    
    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Buat user baru
    User.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res.status(201).json({ 
        message: "User created successfully", 
        id: result.insertId,
        user: { id: result.insertId, ...req.body }
      });
    });
  });
};

// PUT update user
const updateUser = (req, res) => {
  const { name, email, phone, address } = req.body;

  // Validasi input
  if (!name || !email || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Cek apakah user exists
  User.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(404).json({ message: "User not found" });

    // Cek apakah email sudah digunakan oleh user lain
    User.getByEmail(email, (err, emailResults) => {
      if (err) return res.status(500).json({ message: err });
      
      const existingUser = emailResults.find(user => user.id !== parseInt(req.params.id));
      if (existingUser) {
        return res.status(400).json({ message: "Email already used by another user" });
      }

      // Update user
      User.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ message: err });
        res.json({ message: "User updated successfully" });
      });
    });
  });
};

// DELETE user
const deleteUser = (req, res) => {
  // Cek apakah user exists
  User.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(404).json({ message: "User not found" });

    // Hapus user
    User.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ message: err });
      res.json({ message: "User deleted successfully" });
    });
  });
};

// Update user password
// PUT update password
// PUT update password
const updatePassword = (req, res) => {
  const userId = req.params.id;
  const { current_password, new_password, confirm_password } = req.body;

  console.log('🔐 Backend: Password update request received');
  console.log('📥 Request details:', {
    userId,
    userMakingRequest: req.userId,
    hasCurrentPassword: !!current_password,
    hasNewPassword: !!new_password,
    hasConfirmPassword: !!confirm_password
  });

  // Validasi input
  if (!current_password || !new_password || !confirm_password) {
    console.log('❌ Validation failed: Missing fields');
    return res.status(400).json({ message: "All password fields are required" });
  }

  if (new_password !== confirm_password) {
    console.log('❌ Validation failed: Password mismatch');
    return res.status(400).json({ message: "New password and confirmation do not match" });
  }

  if (new_password.length < 6) {
    console.log('❌ Validation failed: Password too short');
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  console.log('🔍 Backend: Looking up user in database...');

  // Get user data dengan password - PASTIKAN menggunakan query yang include password
  User.getById(userId, (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: "Server error during user lookup" });
    }
    
    if (!results.length) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    console.log('✅ User found:', { 
      id: user.id, 
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    // Cek jika password ada di user object
    if (!user.password) {
      console.log('❌ User password is undefined or null');
      return res.status(500).json({ message: "User password data is missing" });
    }

    console.log('🔐 Backend: Verifying current password...');

    // Verify current password
    User.verifyPassword(current_password, user.password, (err, isValid) => {
      if (err) {
        console.error('❌ Password verification error:', err);
        console.error('Error details:', {
          currentPasswordLength: current_password.length,
          storedPasswordLength: user.password.length,
          errorMessage: err.message
        });
        return res.status(500).json({ message: "Server error during password verification" });
      }

      if (!isValid) {
        console.log('❌ Current password is incorrect');
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      console.log('✅ Current password verified successfully');

      // Update password
      User.updatePassword(userId, new_password, (err) => {
        if (err) {
          console.error('❌ Password update error:', err);
          return res.status(500).json({ message: "Failed to update password in database" });
        }

        console.log('✅ Password updated successfully in database');
        res.json({ message: "Password updated successfully" });
      });
    });
  });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
};