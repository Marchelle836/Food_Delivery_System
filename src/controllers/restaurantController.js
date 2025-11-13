const Restaurant = require("../models/restaurantModel.js");

// GET semua restoran
const getRestaurants = (req, res) => {
  Restaurant.getAll((err, results) => {
    if (err) return res.status(500).json({ message: err });
    res.json(results);
  });
};

// GET restoran berdasarkan ID
const getRestaurant = (req, res) => {
  Restaurant.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (!results.length) return res.status(404).json({ message: "Restaurant not found" });
    res.json(results[0]);
  });
};

// POST tambah restoran baru
const createRestaurant = (req, res) => {
  Restaurant.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(201).json({ message: "Restaurant created", id: result.insertId });
  });
};

// PUT update data restoran
const updateRestaurant = (req, res) => {
  Restaurant.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "Restaurant updated" });
  });
};

// DELETE restoran
const deleteRestaurant = (req, res) => {
  Restaurant.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: err });
    res.json({ message: "Restaurant deleted" });
  });
};

module.exports = {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
