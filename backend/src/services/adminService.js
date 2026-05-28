const orderService = require("./orderService");
const billService = require("./billService");

/* MENU */
const getMenu = () => orderService.getMenu();
const addMenu = (data) => orderService.addMenu(data);
const editMenu = (id, data) => orderService.editMenu(id, data);
const deleteMenu = (id) => orderService.deleteMenu(id);
const toggleAvailability = (id) => orderService.toggleAvailability(id);

/* ORDERS */
const getOrders = () => orderService.getOrders();
const addOrder = (data) => orderService.addOrder(data);
const updateOrderStatus = (id, status) =>
  orderService.updateOrderStatus(id, status);
const getOrdersByStatus = (status) =>
  orderService.getOrdersByStatus(status);

/* BILLS (NEW INTEGRATION) */
const getBills = () => billService.getBills();

/* ANALYTICS */
const getTopSelling = () => orderService.getTopSelling();

const getDashboard = () => {
  const orders = getOrders();
  const bills = getBills();

  return {
    totalOrders: orders.length,
    totalBills: bills.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    completedOrders: orders.filter(o => o.status === "completed").length,
    totalRevenue: bills.reduce((sum, b) => sum + b.totalBill, 0),
    topSelling: getTopSelling(),
  };
};

module.exports = {
  getMenu,
  addMenu,
  editMenu,
  deleteMenu,
  toggleAvailability,

  getOrders,
  addOrder,
  updateOrderStatus,
  getOrdersByStatus,

  getBills,

  getTopSelling,
  getDashboard
};