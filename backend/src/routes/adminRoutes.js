const express = require("express");
const router = express.Router();

const controller = require("../controllers/adminController");

/* MENU */
router.get("/menu", controller.getMenu);
router.post("/menu", controller.addMenu);
router.put("/menu/:id", controller.editMenu);
router.delete("/menu/:id", controller.deleteMenu);
router.patch("/menu/toggle/:id", controller.toggleAvailability);

/* ORDERS */
router.get("/orders", controller.getOrders);
router.post("/orders", controller.addOrder);
router.put("/orders/:id", controller.updateOrderStatus);
router.get("/orders/status/:status", controller.getOrdersByStatus);

/* BILLS */
router.get("/bills", controller.getBills);

/* DASHBOARD */
router.get("/dashboard", controller.getDashboard);

module.exports = router;