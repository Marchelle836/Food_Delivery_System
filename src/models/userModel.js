const db = require("../config/db.js");
const bcrypt = require("bcryptjs");

// Ambil semua users
const getAll = (callback) => {
  db.query("SELECT id, name, email, phone, address, created_at, updated_at FROM users ORDER BY created_at DESC", callback);
};

// Ambil satu user berdasarkan ID
const getById = (id, callback) => {
  console.log('🔍 Model: Getting user by ID with password:', id);
  
  // PASTIKAN query ini include password field
  db.query("SELECT id, name, email, password, phone, address, created_at, updated_at FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error('❌ Model: Database error in getById:', err);
      return callback(err);
    }
    
    if (results.length > 0) {
      console.log('✅ Model: User found with password:', {
        id: results[0].id,
        email: results[0].email,
        hasPassword: !!results[0].password,
        passwordPreview: results[0].password ? results[0].password.substring(0, 20) + '...' : 'No password'
      });
    } else {
      console.log('❌ Model: No user found with ID:', id);
    }
    
    callback(err, results);
  });
};

// Ambil user berdasarkan email (termasuk password untuk auth)
const getByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

// Tambah user baru dengan password terenkripsi
const create = (data, callback) => {
  const { name, email, password, phone, address } = data;
  
  // Hash password sebelum disimpan
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);
    
    db.query(
      "INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, address],
      callback
    );
  });
};

// Update user
const update = (id, data, callback) => {
  const { name, email, phone, address } = data;
  db.query(
    "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [name, email, phone, address, id],
    callback
  );
};

// Update password
const updatePassword = (id, newPassword, callback) => {
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) return callback(err);
    
    db.query(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, id],
      callback
    );
  });
};

// Hapus user
const deleteUser = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], callback);
};

// Verify password
const verifyPassword = (plainPassword, hashedPassword, callback) => {
  bcrypt.compare(plainPassword, hashedPassword, callback);
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  create,
  update,
  updatePassword,
  delete: deleteUser,
  verifyPassword,
};