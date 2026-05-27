let menu = [];
let orders = [];

// MENU

exports.addMenu = (data) => {
  const newItem = {
    id: Date.now().toString(),
    ...data
  };
  menu.push(newItem);
  return newItem;
};

exports.editMenu = (id, data) => {
  const index = menu.findIndex(item => item.id === id);

  if (index === -1) return null;

  menu[index] = { ...menu[index], ...data };
  return menu[index];
};

exports.deleteMenu = (id) => {
  const oldLength = menu.length;
  menu = menu.filter(item => item.id !== id);
  return oldLength !== menu.length;
};

exports.getMenu = () => {
  return menu;
};

// ORDERS

exports.addOrder = (data) => {
  const order = {
    id: Date.now().toString(),
    items: data.items,
    totalBill: data.totalBill,
    status: "pending",
    createdAt: new Date()
  };

  orders.push(order);
  return order;
};

exports.getOrders = () => {
  return orders;
};

exports.updateOrderStatus = (id, status) => {
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) return null;

  orders[index].status = status;
  return orders[index];
};