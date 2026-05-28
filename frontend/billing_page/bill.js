/**
 * BREW & CO. — Cafe Bill Page — script.js
 * Backend-ready with local fallback.
 *
 * HOW TO SWITCH TO REAL BACKEND:
 *   1. Start your Node.js server (localhost:5000)
 *   2. Set USE_BACKEND = true below
 *   3. Make sure your API returns: { success: true, data: { subtotal, gst, totalAmount } }
 */

// =============================================
// CONFIG — toggle backend on/off here
// =============================================

const BACKEND_URL  = "http://localhost:5000/api/bill/generate";
const USE_BACKEND  = false; // ← flip to true when your server is running

// =============================================
// DEFAULT DEMO DATA (seeds localStorage once)
// =============================================

const defaultCustomerData = {
  customerName:  "karan",
  orderId:       "ORD1025",
  paymentMethod: "UPI"
};

const defaultOrderItems = [
  { name: "Espresso",   quantity: 1, price: 80  },
  { name: "Cappuccino", quantity: 1, price: 120 }
];

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
let orderItems   = [];
let billResponse = null; // { subtotal, gst, totalAmount }

// =============================================
// UTILITY
// =============================================

function formatRupee(amount) {
  return "\u20b9" + Number(amount).toFixed(0);
}

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
// LOAD DATA FROM localStorage
// =============================================

function loadBillData() {
  try {
    const storedCustomer = localStorage.getItem("customerData");
    const storedItems    = localStorage.getItem("orderItems");
    if (storedCustomer) customerData = JSON.parse(storedCustomer);
    if (storedItems)    orderItems   = JSON.parse(storedItems);
  } catch (err) {
    console.error("Error loading bill data:", err);
    customerData = null;
    orderItems   = [];
  }
}

// =============================================
// LOCAL CALCULATION (fallback)
// =============================================

function calculateLocally() {
  const subtotal    = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst         = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + gst;
  billResponse = { subtotal, gst, totalAmount };
}

// =============================================
// BACKEND API — with local fallback
// =============================================

async function generateBillFromBackend() {

  // If backend is disabled, go straight to local calc
  if (!USE_BACKEND) {
    calculateLocally();
    renderSummary();
    return;
  }

  try {
    const payload = {
      customerName:  customerData?.customerName  || "Guest",
      orderId:       customerData?.orderId       || ("ORD-" + Date.now()),
      paymentMethod: customerData?.paymentMethod || "Cash",
      items: orderItems.map(item => ({
        itemName: item.name,
        quantity: item.quantity,
        price:    item.price
      }))
    };

    const response = await fetch(BACKEND_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("Backend response:", result);

    if (result.success) {
      // Backend returns: { subtotal, gst, totalAmount }
      billResponse = result.data;
    } else {
      console.warn("Backend failure — falling back to local calc.");
      calculateLocally();
    }

  } catch (err) {
    console.warn("Backend unreachable — using local calculation.", err);
    calculateLocally();
  }

  renderSummary();
}

// =============================================
// RENDER: ORDER ITEMS
// =============================================

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

// =============================================
// RENDER: BILL SUMMARY
// =============================================

function renderSummary() {
  if (!billResponse) return;

  const subtotalEl = document.getElementById("subtotal-val");
  const gstEl      = document.getElementById("gst-val");
  const totalEl    = document.getElementById("total-val");

  if (subtotalEl) subtotalEl.textContent = formatRupee(billResponse.subtotal);
  if (gstEl)      gstEl.textContent      = formatRupee(billResponse.gst);
  if (totalEl)    totalEl.textContent    = formatRupee(billResponse.totalAmount);
}

// =============================================
// RENDER: CUSTOMER INFO
// =============================================

function renderCustomerInfo() {
  const name  = customerData?.customerName || "Guest";
  const upper = name.toUpperCase();

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("nav-username",      name.toLowerCase());
  set("success-name",      name.toLowerCase());
  set("billed-name",       upper);
  set("receipt-order-id",  customerData?.orderId       || "N/A");
  set("receipt-payment",   customerData?.paymentMethod || "N/A");
  set("receipt-datetime",  getCurrentDateTime());
}

// =============================================
// RENDER: PAGE STATE (bill or "no order")
// =============================================

function renderPageState() {
  const billContent = document.getElementById("bill-content");
  const noOrderBox  = document.getElementById("no-order-box");
  const hasData     = customerData && orderItems && orderItems.length > 0;

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

function generatePDF() {
  if (!window.jspdf && typeof jsPDF === "undefined") {
    alert("PDF library not loaded. Check your internet connection.");
    return;
  }
  if (!billResponse) {
    alert("Bill not ready yet.");
    return;
  }

  const { jsPDF } = window.jspdf || window;
  const doc = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });

  const name    = (customerData?.customerName || "GUEST").toUpperCase();
  const orderId = customerData?.orderId       || "N/A";
  const payment = customerData?.paymentMethod || "N/A";
  const dt      = getCurrentDateTime();

  let y = 18;

  doc.setFont("times", "bold");   doc.setFontSize(18); doc.setTextColor(43,22,13);
  doc.text("BREW & CO.", 74, y, { align: "center" });

  y += 7;
  doc.setFont("times", "italic"); doc.setFontSize(10); doc.setTextColor(100,80,60);
  doc.text("Thank you for your visit!", 74, y, { align: "center" });

  y += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(130,110,90);
  doc.text(dt, 74, y, { align: "center" });

  y += 5;
  doc.text("Order ID: " + orderId + "  |  Payment: " + payment, 74, y, { align: "center" });

  y += 6;
  doc.setDrawColor(200,180,150); doc.line(14, y, 134, y);

  y += 7;
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(80,60,40);
  doc.text("BILLED TO: " + name, 74, y, { align: "center" });

  y += 5; doc.line(14, y, 134, y);

  y += 7;
  doc.setFont("courier","normal"); doc.setFontSize(10); doc.setTextColor(43,22,13);
  orderItems.forEach(item => {
    doc.text(item.name + " x" + item.quantity, 16, y);
    doc.text(formatRupee(item.price * item.quantity), 132, y, { align: "right" });
    y += 6;
  });

  y += 2;
  doc.setLineDashPattern([1.5,1.5], 0); doc.line(14, y, 134, y); doc.setLineDashPattern([],0);

  y += 7;
  doc.setFontSize(10); doc.setTextColor(100,80,60);
  doc.text("Subtotal", 16, y);
  doc.text(formatRupee(billResponse.subtotal), 132, y, { align: "right" });

  y += 6;
  doc.text("GST (5%)", 16, y);
  doc.text(formatRupee(billResponse.gst), 132, y, { align: "right" });

  y += 4;
  doc.setLineDashPattern([1.5,1.5], 0); doc.line(14, y, 134, y); doc.setLineDashPattern([],0);

  y += 7;
  doc.setFont("courier","bold"); doc.setFontSize(12); doc.setTextColor(43,22,13);
  doc.text("TOTAL", 16, y);
  doc.text(formatRupee(billResponse.totalAmount), 132, y, { align: "right" });

  y += 14;
  doc.setFont("times","italic"); doc.setFontSize(9); doc.setTextColor(150,120,90);
  doc.text("*** Please visit again ***", 74, y, { align: "center" });

  doc.save("BrewAndCo_Bill_" + orderId + ".pdf");
}

// =============================================
// CLEAR ORDER
// =============================================

function clearOrder() {
  localStorage.removeItem("orderItems");
  localStorage.removeItem("customerData");
  window.location.href = "../menu_page/menu.html";
}

// =============================================
// INIT
// =============================================

async function init() {
  loadBillData();
  renderPageState();

  if (customerData && orderItems.length > 0) {
    renderCustomerInfo();
    renderOrderItems();
    await generateBillFromBackend(); // tries backend, falls back locally
  }
}

document.addEventListener("DOMContentLoaded", init);