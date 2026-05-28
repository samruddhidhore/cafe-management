/**
 * BREW & CO. — Cafe Bill Page — script.js
 * Backend Integrated Version
 * Handles:
 * - Load real order data
 * - Send order to backend API
 * - Receive calculated bill
 * - Render bill
 * - Generate PDF
 */

// =============================================
// STATE
// =============================================

let customerData = null;
let orderItems = [];
let billResponse = null;

// =============================================
// UTILITY
// =============================================

/**
 * Format amount as Indian Rupee
 */
function formatRupee(amount) {
  return "₹" + Number(amount).toFixed(0);
}

/**
 * Get current date/time
 */
function getCurrentDateTime() {
  return new Date().toLocaleString("en-IN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

// =============================================
// LOAD ORDER DATA
// =============================================

/**
 * Load real order data from localStorage
 */
function loadBillData() {

  try {

    const storedCustomer =
      localStorage.getItem("customerData");

    const storedItems =
      localStorage.getItem("orderItems");

    if (storedCustomer) {
      customerData = JSON.parse(storedCustomer);
    }

    if (storedItems) {
      orderItems = JSON.parse(storedItems);
    }

  } catch (error) {

    console.error(
      "Error loading bill data:",
      error
    );

    customerData = null;
    orderItems = [];
  }
}

// =============================================
// BACKEND API
// =============================================

/**
 * Send order data to backend
 * Backend calculates bill
 */
async function generateBillFromBackend() {

  try {

    const payload = {

      customerName:
        customerData?.customerName || "Guest",

      orderId:
        customerData?.orderId ||
        `ORD-${Date.now()}`,

      paymentMethod:
        customerData?.paymentMethod || "Cash",

      items: (orderItems || []).map(item => ({
        itemName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    const response = await fetch(
      "http://localhost:5000/api/bill/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    console.log(
      "Backend Response:",
      result
    );

    if (result.success) {

      billResponse = result.data;

      renderSummary();

    } else {

      alert("Failed to generate bill");
    }

  } catch (error) {

    console.error(
      "Backend API Error:",
      error
    );

    alert(
      "Cannot connect to backend server"
    );
  }
}

// =============================================
// RENDER ORDER ITEMS
// =============================================

/**
 * Render order items in bill
 */
function renderOrderItems() {

  const container =
    document.getElementById("order-items");

  if (!container) return;

  container.innerHTML = orderItems.map(item => `

    <div class="order-item-row">

      <span class="item-name">
        ${item.name} x${item.quantity}
      </span>

      <span class="item-price">
        ${formatRupee(item.price * item.quantity)}
      </span>

    </div>

  `).join("");
}

// =============================================
// RENDER SUMMARY
// =============================================

/**
 * Render subtotal, GST and total
 */
function renderSummary() {

  if (!billResponse) return;

  const subtotalEl =
    document.getElementById("subtotal-val");

  const gstEl =
    document.getElementById("gst-val");

  const totalEl =
    document.getElementById("total-val");

  if (subtotalEl) {
    subtotalEl.textContent =
      formatRupee(billResponse.subtotal);
  }

  if (gstEl) {
    gstEl.textContent =
      formatRupee(billResponse.gst);
  }

  if (totalEl) {
    totalEl.textContent =
      formatRupee(billResponse.totalAmount);
  }
}

// =============================================
// RENDER CUSTOMER INFO
// =============================================

/**
 * Render customer details
 */
function renderCustomerInfo() {

  const name =
    customerData?.customerName || "Guest";

  const upper =
    name.toUpperCase();

  const navUsername =
    document.getElementById("nav-username");

  if (navUsername) {
    navUsername.textContent =
      name.toLowerCase();
  }

  const successName =
    document.getElementById("success-name");

  if (successName) {
    successName.textContent =
      name.toLowerCase();
  }

  const billedName =
    document.getElementById("billed-name");

  if (billedName) {
    billedName.textContent = upper;
  }

  const orderIdEl =
    document.getElementById("receipt-order-id");

  const paymentEl =
    document.getElementById("receipt-payment");

  const datetimeEl =
    document.getElementById("receipt-datetime");

  if (orderIdEl) {
    orderIdEl.textContent =
      customerData?.orderId || "N/A";
  }

  if (paymentEl) {
    paymentEl.textContent =
      customerData?.paymentMethod || "N/A";
  }

  if (datetimeEl) {
    datetimeEl.textContent =
      getCurrentDateTime();
  }
}

// =============================================
// PAGE STATE
// =============================================

/**
 * Show bill or no-order screen
 */
function renderPageState() {

  const billContent =
    document.getElementById("bill-content");

  const noOrderBox =
    document.getElementById("no-order-box");

  const hasData =
    customerData &&
    orderItems &&
    orderItems.length > 0;

  if (hasData) {

    if (billContent) {
      billContent.style.display = "block";
    }

    if (noOrderBox) {
      noOrderBox.style.display = "none";
    }

  } else {

    if (billContent) {
      billContent.style.display = "none";
    }

    if (noOrderBox) {
      noOrderBox.style.display = "flex";
    }
  }
}

// =============================================
// PDF GENERATION
// =============================================

/**
 * Generate PDF receipt
 */
function generatePDF() {

  if (
    typeof window.jspdf === "undefined" &&
    typeof jspdf === "undefined" &&
    typeof jsPDF === "undefined"
  ) {

    alert(
      "PDF library not loaded"
    );

    return;
  }

  if (!billResponse) {

    alert(
      "Bill not generated yet"
    );

    return;
  }

  const { jsPDF } =
    window.jspdf || window;

  const doc = new jsPDF({
    unit: "mm",
    format: "a5",
    orientation: "portrait"
  });

  const name =
    customerData?.customerName?.toUpperCase()
    || "GUEST";

  const orderId =
    customerData?.orderId || "N/A";

  const payment =
    customerData?.paymentMethod || "N/A";

  const dt =
    getCurrentDateTime();

  let y = 18;

  // HEADER

  doc.setFont("times", "bold");
  doc.setFontSize(18);

  doc.text(
    "BREW & CO.",
    74,
    y,
    { align: "center" }
  );

  y += 7;

  doc.setFont("times", "italic");
  doc.setFontSize(10);

  doc.text(
    "Thank you for your visit!",
    74,
    y,
    { align: "center" }
  );

  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    dt,
    74,
    y,
    { align: "center" }
  );

  y += 5;

  doc.text(
    `Order ID: ${orderId} | Payment: ${payment}`,
    74,
    y,
    { align: "center" }
  );

  // DIVIDER

  y += 6;

  doc.line(14, y, 134, y);

  // BILLED TO

  y += 7;

  doc.setFont("helvetica", "bold");

  doc.text(
    `BILLED TO: ${name}`,
    74,
    y,
    { align: "center" }
  );

  // ITEMS

  y += 10;

  orderItems.forEach(item => {

    const label =
      `${item.name} x${item.quantity}`;

    const price =
      formatRupee(
        item.price * item.quantity
      );

    doc.text(label, 16, y);

    doc.text(
      price,
      132,
      y,
      { align: "right" }
    );

    y += 6;
  });

  // SUMMARY

  y += 5;

  doc.line(14, y, 134, y);

  y += 8;

  doc.text(
    "Subtotal",
    16,
    y
  );

  doc.text(
    formatRupee(
      billResponse.subtotal
    ),
    132,
    y,
    { align: "right" }
  );

  y += 6;

  doc.text(
    "GST (5%)",
    16,
    y
  );

  doc.text(
    formatRupee(
      billResponse.gst
    ),
    132,
    y,
    { align: "right" }
  );

  y += 8;

  doc.setFont("courier", "bold");
  doc.setFontSize(12);

  doc.text(
    "TOTAL",
    16,
    y
  );

  doc.text(
    formatRupee(
      billResponse.totalAmount
    ),
    132,
    y,
    { align: "right" }
  );

  // FOOTER

  y += 15;

  doc.setFont("times", "italic");
  doc.setFontSize(9);

  doc.text(
    "*** Please visit again ***",
    74,
    y,
    { align: "center" }
  );

  doc.save(
    `BrewAndCo_Bill_${orderId}.pdf`
  );
}

// =============================================
// CLEAR ORDER
// =============================================

/**
 * Clear order and redirect
 */
function clearOrder() {

  localStorage.removeItem("orderItems");

  localStorage.removeItem("customerData");

  window.location.href =
    "menu.html";
}

// =============================================
// INIT
// =============================================

/**
 * Initialize page
 */
async function init() {

  loadBillData();

  renderPageState();

  if (
    customerData &&
    orderItems.length > 0
  ) {

    renderCustomerInfo();

    renderOrderItems();

    await generateBillFromBackend();
  }
}

// =============================================
// START
// =============================================

document.addEventListener(
  "DOMContentLoaded",
  init
);