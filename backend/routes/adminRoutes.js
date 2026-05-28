const express = require("express");
const router = express.Router();

const controller = require("../controllers/adminController");

/* MENU Managment */
router.get("/menu", controller.getMenu);
router.post("/menu", controller.addMenu);
router.put("/menu/:id", controller.editMenu);
router.delete("/menu/:id", controller.deleteMenu);
router.patch("/menu/toggle/:id", controller.toggleAvailability);

/* ORDERS Managment*/
router.get("/orders", controller.getOrders);
router.post("/orders", controller.addOrder);
router.put("/orders/:id", controller.updateOrderStatus);
router.get("/orders/status/:status", controller.getOrdersByStatus);

/* Billing Managment */
router.get("/bills", controller.getBills);

/* Dashboard Statistics */
router.get("/dashboard", controller.getDashboard);

module.exports = router;