const orders = require("../data/orderData");

const addToOrder = (req, res) => {
  const { user, id, name, price, qty } = req.body;

  if (!orders[user]) orders[user] = [];

  const existing = orders[user].find(o => o.id === id);

  if (existing) {
    existing.qty += qty;

    if (existing.qty <= 0) {
      orders[user] = orders[user].filter(o => o.id !== id);
    }
  } else {
    if (qty > 0) {
      orders[user].push({ id, name, price, qty });
    }
  }

  res.json({ success: true, order: orders[user] });
};

const getOrder = (req, res) => {
  const user = req.query.user;
  res.json({ success: true, order: orders[user] || [] });
};

module.exports = { addToOrder, getOrder };