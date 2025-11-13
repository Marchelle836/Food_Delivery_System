const Menu = require("../models/menuModel.js");

// GET semua menu untuk restoran tertentu
const getMenusByRestaurant = (req, res) => {
  Menu.getByRestaurantId(req.params.restaurantId, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    res.json(results);
  });
};

// GET satu menu berdasarkan ID
const getMenu = (req, res) => {
  Menu.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(404).json({ message: "Menu not found" });
    res.json(results[0]);
  });
};

// POST tambah menu ke restoran
const createMenu = (req, res) => {
  const restaurantId = req.params.restaurantId;
  Menu.create({ ...req.body, restaurant_id: restaurantId }, (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(201).json({ message: "Menu created", id: result.insertId });
  });
};

// PUT update menu
const updateMenu = (req, res) => {
  Menu.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "Menu updated" });
  });
};

// DELETE menu
const deleteMenu = (req, res) => {
  Menu.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "Menu deleted" });
  });
};

module.exports = {
  getMenusByRestaurant,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
};
