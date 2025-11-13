const db = require("../config/db.js");

// Ambil semua menu dari restoran
const getByRestaurantId = (restaurantId, callback) => {
  db.query("SELECT * FROM menus WHERE restaurant_id = ?", [restaurantId], callback);
};

// Ambil satu menu
const getById = (id, callback) => {
  db.query("SELECT * FROM menus WHERE id = ?", [id], callback);
};

// Tambah menu baru
const create = (data, callback) => {
  const { restaurant_id, name, price, description } = data;
  db.query(
    "INSERT INTO menus (restaurant_id, name, price, description) VALUES (?, ?, ?, ?)",
    [restaurant_id, name, price, description],
    callback
  );
};

// Update menu
const update = (id, data, callback) => {
  const { name, price, description } = data;
  db.query(
    "UPDATE menus SET name = ?, price = ?, description = ? WHERE id = ?",
    [name, price, description, id],
    callback
  );
};

// Hapus menu
const deleteMenu = (id, callback) => {
  db.query("DELETE FROM menus WHERE id = ?", [id], callback);
};

module.exports = {
  getByRestaurantId,
  getById,
  create,
  update,
  delete: deleteMenu,
};
