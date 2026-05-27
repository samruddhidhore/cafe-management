// Data model mirror to lookup item details based on ID reference keys
const menuItems = [
  { id: 1, name: "Espresso", price: 80, emoji: "☕" },
  { id: 2, name: "Cappuccino", price: 120, emoji: "🍵" },
  { id: 3, name: "Cold Coffee", price: 150, emoji: "🧋" },
  { id: 4, name: "Masala Chai", price: 60, emoji: "🫖" },
  { id: 5, name: "Green Tea", price: 70, emoji: "🍃" },
  { id: 6, name: "Veg Sandwich", price: 110, emoji: "🥪" },
  { id: 7, name: "Brownie", price: 130, emoji: "🍫" },
  { id: 8, name: "Lemonade", price: 90, emoji: "🍋" },
  { id: 9, name: "Latte", price: 140, emoji: "☕" },
  { id: 10, name: "Samosa", price: 40, emoji: "🥟" },
  { id: 11, name: "Mango Shake", price: 120, emoji: "🥭" },
  { id: 12, name: "Cheesecake", price: 180, emoji: "🍰" }
];

// Active State containing item quantities keyed by ID
let currentOrder = {};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Personalize layout header using stored name session tokens
  const customerName = sessionStorage.getItem('customerName');
  if (customerName) {
    document.querySelector(".profile-name").textContent = customerName.toLowerCase();
  }

  // 2. Parse selected ids from localStorage arrays
  const selectedIDs = JSON.parse(localStorage.getItem("selectedItems")) || [];
  
  // Set default initial structure values
  selectedIDs.forEach(id => {
    currentOrder[id] = 1; 
  });

  renderOrderList();
  setupNavigation();
});

// ------ RENDER LIST ------
function renderOrderList() {
  const container = document.getElementById("orderList");
  container.innerHTML = "";

  const activeIDs = Object.keys(currentOrder);

  if (activeIDs.length === 0) {
  container.innerHTML = `
    <div class="empty-state">
      <span>🛒</span>
      <p>Your basket is empty.</p>
      <button class="back-menu-btn" onclick="window.location.href='../menu_page/menu.html'">View Menu</button>
    </div>`;
  updateSummary();
  return;
}

  activeIDs.forEach(idString => {
    const id = parseInt(idString);
    const item = menuItems.find(m => m.id === id);
    if (!item) return;

    const qty = currentOrder[id];
    const row = document.createElement("div");
    row.className = "order-row";

    row.innerHTML = `
      <div class="item-meta">
        <span class="item-emoji">${item.emoji}</span>
        <div>
          <div class="item-title">${item.name}</div>
          <div class="item-base-price">₹${item.price} each</div>
        </div>
      </div>
      <div class="quantity-controls">
        <button class="qty-btn minus" data-id="${item.id}">−</button>
        <span class="qty-val">${qty}</span>
        <button class="qty-btn plus" data-id="${item.id}">+</button>
      </div>
      <div class="item-total-price" id="price-target-${item.id}">₹${item.price * qty}</div>
    `;

    // Manage increment/decrement triggers
    row.querySelector(".minus").addEventListener("click", () => updateQty(id, -1));
    row.querySelector(".plus").addEventListener("click", () => updateQty(id, 1));

    container.appendChild(row);
  });

  updateSummary();
}

// ------ CALCULATION METHOD ------
function updateQty(id, change) {
  if (!currentOrder[id]) return;

  currentOrder[id] += change;

  if (currentOrder[id] <= 0) {
    delete currentOrder[id];
    // Sync back modified state to update tracking arrays
    const remainingKeys = Object.keys(currentOrder).map(Number);
    localStorage.setItem("selectedItems", JSON.stringify(remainingKeys));
    renderOrderList();
  } else {
    // Light render update for performance acceleration
    const rowPrice = document.getElementById(`price-target-${id}`);
    const item = menuItems.find(m => m.id === id);
    rowPrice.textContent = `₹${item.price * currentOrder[id]}`;
    
    // Update structural labels dynamically
    const qtyLabel = rowPrice.parentElement.querySelector(".qty-val");
    qtyLabel.textContent = currentOrder[id];
    
    updateSummary();
  }
}

// ------ SUMMARY PRICING UTILITY ------
function updateSummary() {
  let totalItems = 0;
  let totalPrice = 0;

  Object.keys(currentOrder).forEach(id => {
    const item = menuItems.find(m => m.id === parseInt(id));
    if (item) {
      totalItems += currentOrder[id];
      totalPrice += (item.price * currentOrder[id]);
    }
  });

  document.getElementById("totalItemsCount").textContent = totalItems;
  document.getElementById("totalPriceAmount").textContent = `₹${totalPrice}`;
}

// ------ ROUTING/NAVIGATION BINDINGS ------
function setupNavigation() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.page === "menu") {
        window.location.href = "../menu_page/menu.html";
      }
    });
  });



document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (Object.keys(currentOrder).length === 0) {
    alert("Please add items to your cart from the menu first!");
    return;
  }
  
  // Saves the item counts and quantities so the billing page can read them
  localStorage.setItem("finalOrderSummary", JSON.stringify(currentOrder));
  
  // ✅ REMOVE THE ALERT LINE AND UNCOMMENT THE REDIRECT:
  window.location.href = "../billing_page/bill.html"; 
});}