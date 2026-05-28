const orders = require("../data/orderData");

const ensureUserOrder = (user) => {
  if (!user) return [];
  if (!orders[user]) {
    orders[user] = [];
  }
  return orders[user];
};

const addToOrder = ({ user, id, name, price, qty }) => {
  const userOrder = ensureUserOrder(user);
  const existingItem = userOrder.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += qty;

    if (existingItem.qty <= 0) {
      orders[user] = userOrder.filter(item => item.id !== id);
    }
  } else if (qty > 0) {
    userOrder.push({ id, name, price, qty });
  }

  return orders[user];
};

const getOrder = (user) => {
  return orders[user] || [];
};

module.exports = {
  addToOrder,
  getOrder
};
