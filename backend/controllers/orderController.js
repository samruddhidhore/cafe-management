const orderService = require("../services/orderService");

const addToOrder = (req, res) => {
  const { user, id, name, price, qty } = req.body;

  if (!user) {
    return res.status(400).json({ success: false, message: "Missing user." });
  }

  const order = orderService.addToOrder({ user, id, name, price, qty });
  res.json({ success: true, order });
};

const getOrder = (req, res) => {
  const user = req.query.user;
  const order = orderService.getOrder(user);
  res.json({ success: true, order });
};

module.exports = { addToOrder, getOrder };