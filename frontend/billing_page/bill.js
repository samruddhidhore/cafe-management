```js
/**
 * BREW & CO. — Cafe Bill Page — script.js
 * Backend-ready with local fallback.
 */

// =============================================
// CONFIG — toggle backend on/off here
// =============================================

const BACKEND_URL = "http://localhost:5000/api/bill/generate";

// ENABLE BACKEND
const USE_BACKEND = true;

// =============================================
// DEFAULT DEMO DATA (seeds localStorage once)
// =============================================

const defaultCustomerData = {
  customerName: "karan",
  orderId: "ORD1025",
  paymentMethod: "UPI"
};

const defaultOrderItems = [
  { name: "Espresso", quantity: 1, price: 80 },
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
let orderItems = [];
let billResponse = null;

// =============================================
// UTILITY
// =============================================

function formatRupee(amount) {
  return "₹" + Number(amount).toFixed(0);
}

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
// LOAD DATA FROM localStorage
// =============================================

function loadBillData() {
  try {
    const storedCustomer = localStorage.getItem("customerData");
    const storedItems = localStorage.getItem("orderItems");

    if (storedCustomer) {
      customerData = JSON.parse(storedCustomer);
    }

    if (storedItems) {
      orderItems = JSON.parse(storedItems);
    }

  } catch (err) {
    console.error("Error loading bill data:", err);

    customerData = null;
    orderItems = [];
  }
}

// =============================================
// LOCAL CALCULATION (fallback)
// =============================================

function calculateLocally() {

  const subtotal = orderItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  const gst = Math.round(subtotal * 0.05);

  const totalAmount = subtotal + gst;

  billResponse = {
    subtotal,
    gst,
    totalAmount
  };
}

// =============================================
// BACKEND API — with local fallback
// =============================================

async function generateBillFromBackend() {

  // If backend disabled
  if (!USE_BACKEND) {
    calculateLocally();
    renderSummary();
    return;
  }

  try {

    // PAYLOAD SENT TO BACKEND
    const payload = {

      customerName:
        customerData?.customerName || "Guest",

      orderId:
        customerData?.orderId || ("ORD-" + Date.now()),

      paymentMethod:
        customerData?.paymentMethod || "Cash",

      items: orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    console.log("Sending payload:", payload);

    const response = await fetch(BACKEND_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(payload)
    });

    // ERROR HANDLING
    if (!response.ok) {
      throw new Error("Failed to connect backend");
    }

    const result = await response.json();

    console.log("Backend response:", result);

    // SUCCESS
    if (result.success) {

      billResponse = result.data;

    } else {

      console.warn("Backend failure — using local calculation.");

      calculateLocally();
    }

  } catch (err) {

    console.warn(
      "Backend unreachable — using local calculation.",
      err
    );

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
// RENDER: BILL SUMMARY
// =============================================

function renderSummary() {

  if (!billResponse) return;

  const subtotalEl = document.getElementById("subtotal-val");
  const gstEl = document.getElementById("gst-val");
  const totalEl = document.getElementById("total-val");

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
// RENDER: CUSTOMER INFO
// =============================================

function renderCustomerInfo() {

  const name =
    customerData?.customerName || "Guest";

  const upper = name.toUpperCase();

  const set = (id, val) => {
    const el = document.getElementById(id);

    if (el) {
      el.textContent = val;
    }
  };

  set("nav-username", name.toLowerCase());
  set("success-name", name.toLowerCase());

  set("billed-name", upper);

  set(
    "receipt-order-id",
    customerData?.orderId || "N/A"
  );

  set(
    "receipt-payment",
    customerData?.paymentMethod || "N/A"
  );

  set(
    "receipt-datetime",
    getCurrentDateTime()
  );
}

// =============================================
// RENDER: PAGE STATE
// =============================================

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
// CLEAR ORDER
// =============================================

function clearOrder() {

  localStorage.removeItem("orderItems");

  localStorage.removeItem("customerData");

  window.location.href = "menu.html";
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

    // CONNECTS BACKEND
    await generateBillFromBackend();
  }
}

document.addEventListener("DOMContentLoaded", init);
```