const express = require("express");
const router = express.Router();

const controller = require("../controllers/adminController");

/* MENU */
router.post("/menu", controller.addMenu);
router.get("/menu", controller.getMenu);
router.put("/menu/:id", controller.editMenu);
router.delete("/menu/:id", controller.deleteMenu);
router.patch("/menu/toggle/:id", controller.toggleAvailability);

/* ORDERS */
router.post("/orders", controller.addOrder);
router.get("/orders", controller.getOrders);
router.get("/orders/status/:status", controller.getOrdersByStatus);
router.put("/orders/:id", controller.updateOrderStatus);

/* ANALYTICS */
router.get("/analytics/top-selling", controller.getTopSelling);

module.exports = router;