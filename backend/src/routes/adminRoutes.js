const express = require("express");
const router = express.Router();

const controller = require("./admin.controller");

// MENU
router.post("/menu", controller.addMenu);
router.put("/menu/:id", controller.editMenu);
router.delete("/menu/:id", controller.deleteMenu);
router.get("/menu", controller.getMenu);

// ORDERS
router.post("/orders", controller.addOrder);
router.get("/orders", controller.getOrders);
router.put("/orders/:id", controller.updateOrderStatus);

module.exports = router;