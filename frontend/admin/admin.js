let menuItems = [
  {
    id: 1,
    name: "Espresso",
    category: "Coffee",
    price: 80,
    icon: "⚡",
    available: true,
  },
  {
    id: 2,
    name: "Cappuccino",
    category: "Coffee",
    price: 120,
    icon: "☕",
    available: true,
  },
  {
    id: 3,
    name: "Latte",
    category: "Coffee",
    price: 130,
    icon: "🥛",
    available: true,
  },
  {
    id: 4,
    name: "Cold Brew",
    category: "Cold Drinks",
    price: 150,
    icon: "🧊",
    available: true,
  },
  {
    id: 5,
    name: "Masala Chai",
    category: "Tea",
    price: 60,
    icon: "🍵",
    available: true,
  },
  {
    id: 6,
    name: "Iced Mocha",
    category: "Cold Drinks",
    price: 160,
    icon: "🍫",
    available: true,
  },
  {
    id: 7,
    name: "Green Tea",
    category: "Tea",
    price: 80,
    icon: "🌿",
    available: false,
  },
  {
    id: 8,
    name: "Blueberry Muffin",
    category: "Food",
    price: 90,
    icon: "🧁",
    available: true,
  },
  {
    id: 9,
    name: "Croissant",
    category: "Food",
    price: 110,
    icon: "🥐",
    available: true,
  },
  {
    id: 10,
    name: "Waffle",
    category: "Desserts",
    price: 180,
    icon: "🧇",
    available: false,
  },
];

let nextId = 6;
let editingId = null;
let currentBillFilter = "all";

// TAB SWITCH
function switchTab(tab, btn) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));

  document
    .querySelectorAll(".nav-tab")
    .forEach((t) => t.classList.remove("active"));

  document.getElementById("page-" + tab).classList.add("active");

  btn.classList.add("active");

  if (tab === "menu") renderMenu();

  if (tab === "bills") renderBills();
}

// RENDER MENU
function renderMenu() {
  const container = document.getElementById("menu-categories");

  container.innerHTML = "";

  const categories = [...new Set(menuItems.map((m) => m.category))];

  categories.forEach((cat) => {
    const items = menuItems.filter((m) => m.category === cat);

    let html = `<div class="menu-category-label">${cat}</div>
       <div class="menu-grid">`;

    items.forEach((item) => {
      html += `
      <div class="menu-card">

        <div class="card-actions">
          <button class="card-btn" onclick="editItem(${item.id})">✏️</button>
          <button class="card-btn del" onclick="deleteItem(${item.id})">🗑</button>
        </div>

        <div class="icon">${item.icon}</div>

        <div class="item-name">${item.name}</div>

        <span class="category-tag">${item.category}</span>

        <div class="item-price">₹${item.price}</div>

        <div class="avail-toggle">

          <button
            class="toggle ${item.available ? "on" : "off"}"
            onclick="toggleAvail(${item.id})">
          </button>

          <span class="toggle-label">
            ${item.available ? "Available" : "Unavailable"}
          </span>

        </div>

      </div>`;
    });

    html += `</div>`;

    container.innerHTML += html;
  });
}

// TOGGLE
function toggleAvail(id) {
  const item = menuItems.find((m) => m.id === id);

  item.available = !item.available;

  renderMenu();
}

// DELETE
function deleteItem(id) {
  if (!confirm("Delete this item?")) return;

  menuItems = menuItems.filter((m) => m.id !== id);

  renderMenu();
}

// EDIT
function editItem(id) {
  const item = menuItems.find((m) => m.id === id);

  editingId = id;

  document.getElementById("modal-title").textContent = "Edit Menu Item";

  document.getElementById("f-name").value = item.name;

  document.getElementById("f-category").value = item.category;

  document.getElementById("f-price").value = item.price;

  document.getElementById("f-icon").value = item.icon;

  document.getElementById("menu-modal").classList.add("open");
}

// OPEN MODAL
function openMenuModal() {
  editingId = null;

  document.getElementById("modal-title").textContent = "Add Menu Item";

  document.getElementById("f-name").value = "";

  document.getElementById("f-price").value = "";

  document.getElementById("f-icon").value = "";

  document.getElementById("menu-modal").classList.add("open");
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("menu-modal").classList.remove("open");
}

// SAVE ITEM
function saveMenuItem() {
  const name = document.getElementById("f-name").value.trim();

  const category = document.getElementById("f-category").value;

  const price = parseInt(document.getElementById("f-price").value);

  const icon = document.getElementById("f-icon").value.trim() || "☕";

  if (!name || !price) {
    alert("Please fill all fields");

    return;
  }

  if (editingId) {
    const item = menuItems.find((m) => m.id === editingId);

    Object.assign(item, {
      name,
      category,
      price,
      icon,
    });
  } else {
    menuItems.push({
      id: nextId++,
      name,
      category,
      price,
      icon,
      available: true,
    });
  }

  closeModal();

  renderMenu();
}

// RENDER BILLS
function renderBills() {
  const container = document.getElementById("bills-list");

  const filtered =
    currentBillFilter === "all"
      ? bills
      : bills.filter((b) => b.status === currentBillFilter);

  container.innerHTML = filtered
    .map(
      (b) => `
      <div class="bill-card">

        <div class="bill-id">${b.id}</div>

        <div class="bill-info">
          <div class="bill-customer">${b.customer}</div>
          <div class="bill-items-list">${b.items}</div>
        </div>

        <div class="bill-date">${b.date}</div>

        <div class="bill-total">₹${b.total}</div>

      </div>
    `,
    )
    .join("");
}

// FILTER BILLS
function filterBills(filter, btn) {
  currentBillFilter = filter;

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");

  renderBills();
}

// INITIAL LOAD
renderMenu();

renderBills();
