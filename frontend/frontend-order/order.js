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

const user = sessionStorage.getItem("customerName") || "guest";

// LOAD ORDER
function loadOrder() {
  fetch(`http://localhost:5000/api/orders?user=${user}`)
    .then(res => res.json())
    .then(data => {
      const items = data.order || [];
      render(items);
      updateSummary(items);
    });
}

+

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
 
 +       </div>

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

// UPDATE SUMMARY VALUES (subtotal, gst, total, customer name)
function updateSummary(items) {
  const nameEl = document.getElementById("bill-customer-name");
  const subtotalEl = document.getElementById("bill-subtotal");
  const gstEl = document.getElementById("bill-gst");
  const totalEl = document.getElementById("bill-total-amount");

  const customerName = sessionStorage.getItem("customerName") || "Guest";

  if (nameEl) nameEl.textContent = customerName;

  const subtotal = items.reduce((s, it) => s + (it.price || it.price === 0 ? it.price * (it.qty || it.qty === 0 ? it.qty : it.qty) : 0), 0);

  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (gstEl) gstEl.textContent = `₹${gst}`;
  if (totalEl) totalEl.textContent = `₹${total}`;

  // store a draft summary in localStorage so billing page can pick it up if needed
  localStorage.setItem("orderSummary", JSON.stringify({ customerName, subtotal, gst, total }));
}

// PLACE ORDER BUTTON — save customerData and orderItems then navigate to bill page
function handlePlaceOrderClick() {
  fetch(`http://localhost:5000/api/orders?user=${user}`)
    .then(res => res.json())
    .then(data => {
      const items = data.order || [];

      if (!items.length) {
        alert("No items in order to place");
        return;
      }

      const customerName = sessionStorage.getItem("customerName") || "Guest";

      const customerData = {
        customerName,
        orderId: `ORD-${Date.now()}`,
        paymentMethod: "Cash"
      };

      const orderItems = items.map(it => ({ name: it.name, quantity: it.qty, price: it.price }));

      localStorage.setItem("customerData", JSON.stringify(customerData));
      localStorage.setItem("orderItems", JSON.stringify(orderItems));

      // navigate to billing page
      window.location.href = "../billing_page/bill.html";
    })
    .catch(err => {
      console.error(err);
      alert("Could not place order — server error");
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