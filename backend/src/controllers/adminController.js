const service = require("./admin.service");

// MENU
exports.addMenu = (req, res) => {
  const data = service.addMenu(req.body);
  res.json(data);
};

exports.editMenu = (req, res) => {
  const data = service.editMenu(req.params.id, req.body);

  if (!data) return res.status(404).json({ message: "Menu not found" });

  res.json(data);
};

exports.deleteMenu = (req, res) => {
  const success = service.deleteMenu(req.params.id);

  if (!success) return res.status(404).json({ message: "Menu not found" });

  res.json({ message: "Deleted successfully" });
};

exports.getMenu = (req, res) => {
  res.json(service.getMenu());
};

// ORDERS
exports.addOrder = (req, res) => {
  const data = service.addOrder(req.body);
  res.json(data);
};

exports.getOrders = (req, res) => {
  res.json(service.getOrders());
};

exports.updateOrderStatus = (req, res) => {
  const data = service.updateOrderStatus(req.params.id, req.body.status);

  if (!data) return res.status(404).json({ message: "Order not found" });

  res.json(data);
};