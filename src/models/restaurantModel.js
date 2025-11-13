const db = require("../config/db.js");

// Ambil semua restoran
const getAll = (callback) => {
  db.query("SELECT * FROM restaurants", callback);
};

// Ambil restoran berdasarkan ID
const getById = (id, callback) => {
  db.query("SELECT * FROM restaurants WHERE id = ?", [id], callback);
};

// Tambah restoran
const create = (data, callback) => {
  const { name, address } = data;
  db.query(
    "INSERT INTO restaurants (name, address) VALUES (?, ?)",
    [name, address],
    callback
  );
};

// Update restoran
const update = (id, data, callback) => {
  const { name, address } = data;
  db.query(
    "UPDATE restaurants SET name = ?, address = ? WHERE id = ?",
    [name, address, id],
    callback
  );
};

// Hapus restoran
const deleteRestaurant = (id, callback) => {
  db.query("DELETE FROM restaurants WHERE id = ?", [id], callback);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteRestaurant,
};
