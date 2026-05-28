
const service = require("../services/adminService");

/* MENU */
exports.addMenu = (req, res) => res.json(service.addMenu(req.body));

exports.getMenu = (req, res) => res.json(service.getMenu());

exports.editMenu = (req, res) => {
  const result = service.editMenu(req.params.id, req.body);
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json(result);
};

exports.deleteMenu = (req, res) => {
  const result = service.deleteMenu(req.params.id);
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};

exports.toggleAvailability = (req, res) => {
  const result = service.toggleAvailability(req.params.id);
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json(result);
};

/* ORDERS */
exports.addOrder = (req, res) => res.json(service.addOrder(req.body));

exports.getOrders = (req, res) => res.json(service.getOrders());

exports.getOrdersByStatus = (req, res) =>
  res.json(service.getOrdersByStatus(req.params.status));

exports.updateOrderStatus = (req, res) => {
  const result = service.updateOrderStatus(req.params.id, req.body.status);
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json(result);
};

/* ANALYTICS */
exports.getTopSelling = (req, res) =>
  res.json(service.getTopSelling());