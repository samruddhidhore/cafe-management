let menu = [
  { id: "1", name: "Espresso", category: "Coffee", price: 80, icon: "⚡", available: true },
  { id: "2", name: "Cappuccino", category: "Coffee", price: 120, icon: "☕", available: true },
  { id: "3", name: "Latte", category: "Coffee", price: 130, icon: "🥛", available: true }
];

let orders = [];

/* MENU */
const addMenu = (data) => {
  const item = { id: Date.now().toString(), ...data, available: true };
  menu.push(item);
  return item;
};

const editMenu = (id, data) => {
  const i = menu.findIndex(m => m.id === id);
  if (i === -1) return null;
  menu[i] = { ...menu[i], ...data };
  return menu[i];
};

const deleteMenu = (id) => {
  const before = menu.length;
  menu = menu.filter(m => m.id !== id);
  return before !== menu.length;
};

const getMenu = () => menu;

const toggleAvailability = (id) => {
  const item = menu.find(m => m.id === id);
  if (!item) return null;
  item.available = !item.available;
  return item;
};

/* ORDERS */
const addOrder = (data) => {
  const order = {
    id: Date.now().toString(),
    customer: data.customer,
    items: data.items,
    totalBill: data.totalBill,
    status: "pending",
    createdAt: new Date()
  };
  orders.push(order);
  return order;
};

const getOrders = () => orders;

const updateOrderStatus = (id, status) => {
  const order = orders.find(o => o.id === id);
  if (!order) return null;
  order.status = status;
  return order;
};

const getOrdersByStatus = (status) => {
  if (!status || status === "all") return orders;
  return orders.filter(o => o.status === status);
};

const getTopSelling = () => {
  const stats = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      if (!stats[item.name]) {
        stats[item.name] = { orders: 0, revenue: 0 };
      }
      stats[item.name].orders += item.qty;
      stats[item.name].revenue += item.qty * item.price;
    });
  });

  return stats;
};

module.exports = {
  addMenu,
  editMenu,
  deleteMenu,
  getMenu,
  toggleAvailability,
  addOrder,
  getOrders,
  updateOrderStatus,
  getOrdersByStatus,
  getTopSelling
};