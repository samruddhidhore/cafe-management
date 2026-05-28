// admin.js
const API_BASE = "http://localhost:5000/admin";

let menuItems = [];
let bills = [];

let editingId = null;
let currentBillFilter = "all";



/* =========================
   LOAD MENU FROM BACKEND
========================= */

async function loadMenu() {
  try {
    const res = await fetch(`${API_BASE}/menu`);

    const data = await res.json();

    menuItems = data;

    renderMenu();
  } catch (err) {
    console.error("Error loading menu:", err);
  }
}



/* =========================
   LOAD BILLS / ORDERS
========================= */

async function loadBills(status = "all") {
  try {
    const url =
      status === "all"
        ? `${API_BASE}/orders`
        : `${API_BASE}/orders/status/${status}`;

    const res = await fetch(url);

    const data = await res.json();

    bills = data;

    renderBills();
  } catch (err) {
    console.error("Error loading bills:", err);
  }
}



/* =========================
   TAB SWITCH
========================= */

function switchTab(tab, btn) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));

  document
    .querySelectorAll(".nav-tab")
    .forEach((t) => t.classList.remove("active"));

  document.getElementById("page-" + tab).classList.add("active");

  btn.classList.add("active");

  if (tab === "menu") {
    loadMenu();
  }

  if (tab === "bills") {
    loadBills(currentBillFilter);
  }
}



/* =========================
   RENDER MENU
========================= */

function renderMenu() {
  const container = document.getElementById("menu-categories");

  container.innerHTML = "";

  const categories = [...new Set(menuItems.map((m) => m.category))];

  categories.forEach((cat) => {
    const items = menuItems.filter((m) => m.category === cat);

    let html = `
      <div class="menu-category-label">${cat}</div>
      <div class="menu-grid">
    `;

    items.forEach((item) => {
      html += `
      <div class="menu-card">

        <div class="card-actions">
          <button class="card-btn" onclick="editItem('${item.id}')">✏️</button>

          <button class="card-btn del"
            onclick="deleteItem('${item.id}')">
            🗑
          </button>
        </div>

        <div class="icon">${item.icon}</div>

        <div class="item-name">${item.name}</div>

        <span class="category-tag">${item.category}</span>

        <div class="item-price">₹${item.price}</div>

        <div class="avail-toggle">

          <button
            class="toggle ${item.available ? "on" : "off"}"
            onclick="toggleAvail('${item.id}')">
          </button>

          <span class="toggle-label">
            ${item.available ? "Available" : "Unavailable"}
          </span>

        </div>

      </div>
      `;
    });

    html += `</div>`;

    container.innerHTML += html;
  });
}



/* =========================
   TOGGLE AVAILABILITY
========================= */

async function toggleAvail(id) {
  try {
    await fetch(`${API_BASE}/menu/toggle/${id}`, {
      method: "PATCH",
    });

    loadMenu();
  } catch (err) {
    console.error(err);
  }
}



/* =========================
   DELETE MENU ITEM
========================= */

async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;

  try {
    await fetch(`${API_BASE}/menu/${id}`, {
      method: "DELETE",
    });

    loadMenu();
  } catch (err) {
    console.error(err);
  }
}



/* =========================
   EDIT MENU ITEM
========================= */

function editItem(id) {
  const item = menuItems.find((m) => m.id === id);

  editingId = id;

  document.getElementById("modal-title").textContent =
    "Edit Menu Item";

  document.getElementById("f-name").value = item.name;

  document.getElementById("f-category").value =
    item.category;

  document.getElementById("f-price").value =
    item.price;

  document.getElementById("f-icon").value =
    item.icon;

  document.getElementById("menu-modal").classList.add("open");
}



/* =========================
   OPEN MODAL
========================= */

function openMenuModal() {
  editingId = null;

  document.getElementById("modal-title").textContent =
    "Add Menu Item";

  document.getElementById("f-name").value = "";

  document.getElementById("f-price").value = "";

  document.getElementById("f-icon").value = "";

  document.getElementById("menu-modal").classList.add("open");
}



/* =========================
   CLOSE MODAL
========================= */

function closeModal() {
  document.getElementById("menu-modal").classList.remove("open");
}



/* =========================
   SAVE ITEM
========================= */

async function saveMenuItem() {
  const name = document.getElementById("f-name").value.trim();

  const category =
    document.getElementById("f-category").value;

  const price =
    parseInt(document.getElementById("f-price").value);

  const icon =
    document.getElementById("f-icon").value.trim() || "☕";

  if (!name || !price) {
    alert("Please fill all fields");
    return;
  }

  const bodyData = {
    name,
    category,
    price,
    icon,
  };

  try {

    /* EDIT */
    if (editingId) {
      await fetch(`${API_BASE}/menu/${editingId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(bodyData),
      });

    }

    /* ADD */
    else {
      await fetch(`${API_BASE}/menu`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(bodyData),
      });
    }

    closeModal();

    loadMenu();

  } catch (err) {
    console.error(err);
  }
}



/* =========================
   RENDER BILLS
========================= */

function renderBills() {
  const container = document.getElementById("bills-list");

  container.innerHTML = bills
    .map(
      (b) => `
      <div class="bill-card">

        <div class="bill-id">${b.id}</div>

        <div class="bill-info">
          <div class="bill-customer">
            ${b.customer}
          </div>

          <div class="bill-items-list">
            ${Array.isArray(b.items)
              ? b.items.map(i => `${i.name} × ${i.qty}`).join(", ")
              : b.items}
          </div>
        </div>

        <div class="bill-date">
          ${new Date(b.createdAt).toLocaleDateString()}
        </div>

        <div class="bill-total">
          ₹${b.totalBill}
        </div>

      </div>
    `
    )
    .join("");
}



/* =========================
   FILTER BILLS
========================= */

function filterBills(filter, btn) {
  currentBillFilter = filter;

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");

  loadBills(filter);
}



/* =========================
   INITIAL LOAD
========================= */

loadMenu();

loadBills();