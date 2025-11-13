const express = require("express");
const {
  getMenusByRestaurant,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController.js");

const router = express.Router({ mergeParams: true });

router.get("/", getMenusByRestaurant);
router.get("/:id", getMenu);
router.post("/", createMenu);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);

module.exports = router;
