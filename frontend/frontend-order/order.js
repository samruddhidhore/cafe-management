const menuBtn = document.getElementById("menuBtn");
const orderBtn = document.getElementById("orderBtn");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    window.location.href = "../menu_page/menu.html";
  });
}

if (orderBtn) {
  orderBtn.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
}

const user = localStorage.getItem("userName") || "Guest";

// LOAD ORDER
function loadOrder() {
  fetch(`http://localhost:5000/api/orders?user=${user}`)
    .then(res => res.json())
    .then(data => {
      render(data.order || []);
    });
}



// RENDER ITEMS ONLY
function render(items) {
  const container = document.getElementById("order-items-container");
  const badge = document.getElementById("order-badge-count");

  container.innerHTML = "";
  badge.innerText = items.length;

  if (!items.length) {
    container.innerHTML = `<div class="empty-order-msg">No items in order 🍽️</div>`;
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "selected-item-card";

    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <span>₹${item.price}</span>
      </div>

      <div>
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <b>${item.qty}</b>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>

      <div>₹${item.price * item.qty}</div>
    `;

    container.appendChild(div);
  });
}

// UPDATE QTY
function changeQty(id, qty) {
  fetch("http://localhost:5000/api/orders/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user, id, qty })
  }).then(() => loadOrder());
}

// INIT
loadOrder();