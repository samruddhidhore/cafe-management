const orderService = require('../services/orderService');
const billService = require("../Services/billService");
const adminService = require('../services/adminService');

/* MENU Managment */
const getMenu = () => orderService.getMenu();
const addMenu = (data) => orderService.addMenu(data);
const editMenu = (id, data) => orderService.editMenu(id, data);
const deleteMenu = (id) => orderService.deleteMenu(id);
const toggleAvailability = (id) => orderService.toggleAvailability(id);

/* ORDER Managment */
const getOrders = () => orderService.getOrders();
const addOrder = (data) => orderService.addOrder(data);
const updateOrderStatus = (id, status) =>
  orderService.updateOrderStatus(id, status);
const getOrdersByStatus = (status) =>
  orderService.getOrdersByStatus(status);

/* Billing Managment */
const getBills = () => billService.getBills();

/* SALES ANALYTICS */
const getTopSelling = () => orderService.getTopSelling();

/* Dashboard Statistics*/
const getDashboard = () => {
  const orders = orderService.getOrders();
  const bills = billService.getBills();

  const totalOrders = orders.length;
  const totalBills = bills.length;

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  const totalRevenue = bills.reduce((sum, b) => {
    return sum + (b.totalBill || b.total || 0);
  }, 0);

  return {
    totalOrders,
    totalBills,
    pendingOrders,
    completedOrders,
    totalRevenue,
    topSelling: orderService.getTopSelling(),
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
  getDashboard,
};