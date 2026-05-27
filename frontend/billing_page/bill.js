/**
 * BREW & CO. — Cafe Bill Page — script.js
 * Handles: Dynamic rendering, localStorage, calculations, PDF generation
 */

// =============================================
// DEFAULT / DEMO DATA
// =============================================

const defaultCustomerData = {
  customerName: "karan",
  orderId: "ORD1025",
  paymentMethod: "UPI"
};

const defaultOrderItems = [
  { name: "Espresso",   quantity: 1, price: 80  },
  { name: "Cappuccino", quantity: 1, price: 120 }
];

// Seed localStorage with demo data if not already set
if (!localStorage.getItem("customerData")) {
  localStorage.setItem("customerData", JSON.stringify(defaultCustomerData));
}
if (!localStorage.getItem("orderItems")) {
  localStorage.setItem("orderItems", JSON.stringify(defaultOrderItems));
}

// =============================================
// STATE
// =============================================

let customerData = null;
let orderItems    = [];
let subtotal      = 0;
let gstAmount     = 0;
let total         = 0;

// =============================================
// UTILITY
// =============================================

/**
 * Format a number as Indian Rupee string (₹)
 * @param {number} amount
 * @returns {string}
 */
function formatRupee(amount) {
  return "₹" + amount.toFixed(0);
}

/**
 * Generate formatted current date/time string
 * @returns {string}
 */
function getCurrentDateTime() {
  return new Date().toLocaleString("en-IN", {
    year:   "numeric",
    month:  "numeric",
    day:    "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

// =============================================
// DATA LOADING
// =============================================

/**
 * Load bill data from localStorage (or future API)
 * Falls back to null if not available
 */
function loadBillData() {
  try {
    const storedCustomer = localStorage.getItem("customerData");
    const storedItems    = localStorage.getItem("orderItems");

    if (storedCustomer) {
      customerData = JSON.parse(storedCustomer);
    }
    if (storedItems) {
      orderItems = JSON.parse(storedItems);
    }
  } catch (err) {
    console.error("Error loading bill data:", err);
    customerData = null;
    orderItems   = [];
  }
}

// =============================================
// CALCULATIONS
// =============================================

/**
 * Calculate subtotal, GST (5%), and total
 */
function calculateTotals() {
  subtotal  = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  gstAmount = Math.round(subtotal * 0.05);
  total     = subtotal + gstAmount;
}

// =============================================
// RENDERING
// =============================================

/**
 * Render all order items inside #order-items
 */
function renderOrderItems() {
  const container = document.getElementById("order-items");
  if (!container) return;

  container.innerHTML = orderItems.map(item => `
    <div class="order-item-row">
      <span class="item-name">${item.name} x${item.quantity}</span>
      <span class="item-price">${formatRupee(item.price * item.quantity)}</span>
    </div>
  `).join("");
}

/**
 * Render bill summary (subtotal, GST, total)
 */
function renderSummary() {
  const subtotalEl = document.getElementById("subtotal-val");
  const gstEl      = document.getElementById("gst-val");
  const totalEl    = document.getElementById("total-val");

  if (subtotalEl) subtotalEl.textContent = formatRupee(subtotal);
  if (gstEl)      gstEl.textContent      = formatRupee(gstAmount);
  if (totalEl)    totalEl.textContent    = formatRupee(total);
}

/**
 * Populate all customer-related fields in the UI
 */
function renderCustomerInfo() {
  const name = customerData?.customerName || "Guest";
  const upper = name.toUpperCase();

  // Navbar username
  const navUsername = document.getElementById("nav-username");
  if (navUsername) navUsername.textContent = name.toLowerCase();

  // Success message name
  const successName = document.getElementById("success-name");
  if (successName) successName.textContent = name.toLowerCase();

  // Billed to
  const billedName = document.getElementById("billed-name");
  if (billedName) billedName.textContent = upper;

  // Receipt meta
  const orderIdEl  = document.getElementById("receipt-order-id");
  const paymentEl  = document.getElementById("receipt-payment");
  const datetimeEl = document.getElementById("receipt-datetime");

  if (orderIdEl)  orderIdEl.textContent  = customerData?.orderId       || "N/A";
  if (paymentEl)  paymentEl.textContent  = customerData?.paymentMethod || "N/A";
  if (datetimeEl) datetimeEl.textContent = getCurrentDateTime();
}

/**
 * Show or hide the "no order" state vs bill content
 */
function renderPageState() {
  const billContent = document.getElementById("bill-content");
  const noOrderBox  = document.getElementById("no-order-box");

  const hasData = customerData && orderItems && orderItems.length > 0;

  if (hasData) {
    if (billContent) billContent.style.display = "block";
    if (noOrderBox)  noOrderBox.style.display  = "none";
  } else {
    if (billContent) billContent.style.display = "none";
    if (noOrderBox)  noOrderBox.style.display  = "flex";
  }
}

// =============================================
// PDF GENERATION
// =============================================

/**
 * Generate and download a PDF receipt using jsPDF
 */
function generatePDF() {
  if (typeof window.jspdf === "undefined" && typeof jspdf === "undefined" && typeof jsPDF === "undefined") {
    alert("PDF library not loaded. Please check your internet connection.");
    return;
  }

  // Support both module and global jsPDF
  const { jsPDF } = window.jspdf || window;
  const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });

  const name    = customerData?.customerName?.toUpperCase() || "GUEST";
  const orderId = customerData?.orderId       || "N/A";
  const payment = customerData?.paymentMethod || "N/A";
  const dt      = getCurrentDateTime();

  let y = 18;

  // Header
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(43, 22, 13);
  doc.text("BREW & CO.", 74, y, { align: "center" });

  y += 7;
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(100, 80, 60);
  doc.text("Thank you for your visit!", 74, y, { align: "center" });

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(130, 110, 90);
  doc.text(dt, 74, y, { align: "center" });

  y += 5;
  doc.text(`Order ID: ${orderId}  |  Payment: ${payment}`, 74, y, { align: "center" });

  // Divider
  y += 6;
  doc.setDrawColor(200, 180, 150);
  doc.line(14, y, 134, y);

  // Billed To
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(80, 60, 40);
  doc.text(`BILLED TO: ${name}`, 74, y, { align: "center" });

  // Divider
  y += 5;
  doc.line(14, y, 134, y);

  // Items
  y += 7;
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(43, 22, 13);

  orderItems.forEach(item => {
    const label = `${item.name} x${item.quantity}`;
    const price = formatRupee(item.price * item.quantity);
    doc.text(label, 16, y);
    doc.text(price, 132, y, { align: "right" });
    y += 6;
  });

  // Dashed divider
  y += 2;
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.setDrawColor(200, 180, 150);
  doc.line(14, y, 134, y);
  doc.setLineDashPattern([], 0);

  // Summary
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(100, 80, 60);
  doc.text("Subtotal", 16, y);
  doc.text(formatRupee(subtotal), 132, y, { align: "right" });

  y += 6;
  doc.text("GST (5%)", 16, y);
  doc.text(formatRupee(gstAmount), 132, y, { align: "right" });

  // Dashed divider
  y += 4;
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(14, y, 134, y);
  doc.setLineDashPattern([], 0);

  // Total
  y += 7;
  doc.setFont("courier", "bold");
  doc.setFontSize(12);
  doc.setTextColor(43, 22, 13);
  doc.text("TOTAL", 16, y);
  doc.text(formatRupee(total), 132, y, { align: "right" });

  // Footer
  y += 14;
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(150, 120, 90);
  doc.text("*** Please visit again ***", 74, y, { align: "center" });

  doc.save(`BrewAndCo_Bill_${orderId}.pdf`);
}

// =============================================
// CLEAR ORDER / START NEW
// =============================================

/**
 * Clear cart/order data from localStorage and redirect
 */
function clearOrder() {
  localStorage.removeItem("orderItems");
  localStorage.removeItem("customerData");
  // Redirect to menu page
  window.location.href = "menu.html";
}

// =============================================
// INIT
// =============================================

/**
 * Main init: load data → calculate → render
 */
function init() {
  loadBillData();
  calculateTotals();
  renderPageState();

  if (customerData && orderItems.length > 0) {
    renderCustomerInfo();
    renderOrderItems();
    renderSummary();
  }
}

// Run on DOM ready
document.addEventListener("DOMContentLoaded", init);