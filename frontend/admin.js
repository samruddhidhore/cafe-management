const API = "http://localhost:5000/admin";

/* ---------------- MENU ---------------- */

async function fetchMenu() {
  const res = await fetch(`${API}/menu`);
  return await res.json();
}

async function addMenuItem(data) {
  await fetch(`${API}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  renderMenu();
}

async function updateMenuItem(id, data) {
  await fetch(`${API}/menu/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  renderMenu();
}

async function deleteMenuItem(id) {
  await fetch(`${API}/menu/${id}`, {
    method: "DELETE",
  });
  renderMenu();
}

/* ---------------- ORDERS ---------------- */

async function fetchOrders() {
  const res = await fetch(`${API}/orders`);
  return await res.json();
}

async function updateOrderStatus(id, status) {
  await fetch(`${API}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

/* ---------------- BILLS ---------------- */

async function fetchBills() {
  const res = await fetch(`http://localhost:5000/bills`);
  return await res.json();
}

/* ---------------- DASHBOARD ---------------- */

async function loadDashboard() {
  try {
    const res = await fetch(`${API}/dashboard`);
    const data = await res.json();

    document.getElementById("orders").innerText = data.totalOrders;
    document.getElementById("bills").innerText = data.totalBills;
    document.getElementById("revenue").innerText = data.totalRevenue;
  } catch (err) {
    console.error("Dashboard API missing in backend:", err);
  }
}

/* ---------------- RENDER MENU ---------------- */

async function renderMenu() {
  const menuItems = await fetchMenu();

  const container = document.getElementById("menu-categories");
  container.innerHTML = "";

  const categories = [...new Set(menuItems.map(m => m.category))];

  categories.forEach(cat => {
    const items = menuItems.filter(m => m.category === cat);

    let html = `<div class="menu-category-label">${cat}</div><div class="menu-grid">`;

    items.forEach(item => {
      html += `
        <div class="menu-card">
          <div class="icon">${item.icon}</div>
          <div>${item.name}</div>
          <div>₹${item.price}</div>

          <button onclick="deleteMenuItem('${item.id}')">Delete</button>

          <button onclick="updateMenuItem('${item.id}', {
            available: ${!item.available}
          })">
            Toggle
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML += html;
  });
}

/* ---------------- RENDER ORDERS ---------------- */

async function renderOrders() {
  const orders = await fetchOrders();

  console.log("Orders:", orders);

  // You can build UI here
}

/* ---------------- RENDER BILLS ---------------- */

async function renderBills() {
  const bills = await fetchBills();

  const container = document.getElementById("bills-list");

  container.innerHTML = bills
    .map(
      b => `
      <div class="bill-card">
        <div>${b.id}</div>
        <div>${b.customer}</div>
        <div>${b.items}</div>
        <div>₹${b.total}</div>
        <div>${b.status}</div>
      </div>
    `
    )
    .join("");
}

/* ---------------- INIT ---------------- */

renderMenu();
renderBills();
loadDashboard();