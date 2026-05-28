const express = require("express");
const router = express.Router();

const {
  addToOrder,
  getOrder
} = require("../controllers/orderController");

// ADD ITEM
router.post("/add", addToOrder);

// GET ORDER
router.get("/", getOrder);

module.exports = router;