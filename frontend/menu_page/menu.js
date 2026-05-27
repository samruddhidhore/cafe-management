// =============================================
//  BREW & CO. — Café Management
//  script.js
// =============================================

// ------ MENU DATA ------
const menuItems = [
  {
    id: 1,
    name: "Espresso",
    description: "Rich & bold single shot",
    price: 80,
    category: "coffee",
    emoji: "☕"
  },
  {
    id: 2,
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    price: 120,
    category: "coffee",
    emoji: "🍵"
  },
  {
    id: 3,
    name: "Cold Coffee",
    description: "Chilled coffee with cream",
    price: 150,
    category: "coffee",
    emoji: "🧋"
  },
  {
    id: 4,
    name: "Masala Chai",
    description: "Spiced Indian tea",
    price: 60,
    category: "tea",
    emoji: "🫖"
  },
  {
    id: 5,
    name: "Green Tea",
    description: "Light & refreshing",
    price: 70,
    category: "tea",
    emoji: "🍃"
  },
  {
    id: 6,
    name: "Veg Sandwich",
    description: "Grilled with fresh veggies",
    price: 110,
    category: "snacks",
    emoji: "🥪"
  },
  {
    id: 7,
    name: "Brownie",
    description: "Warm fudgy chocolate brownie",
    price: 130,
    category: "desserts",
    emoji: "🍫"
  },
  {
    id: 8,
    name: "Lemonade",
    description: "Fresh squeezed with mint",
    price: 90,
    category: "drinks",
    emoji: "🍋"
  },
  {
    id: 9,
    name: "Latte",
    description: "Smooth espresso with silky milk",
    price: 140,
    category: "coffee",
    emoji: "☕"
  },
  {
    id: 10,
    name: "Samosa",
    description: "Crispy stuffed pastry, served hot",
    price: 40,
    category: "snacks",
    emoji: "🥟"
  },
  {
    id: 11,
    name: "Mango Shake",
    description: "Thick & creamy mango blend",
    price: 120,
    category: "drinks",
    emoji: "🥭"
  },
  {
    id: 12,
    name: "Cheesecake",
    description: "Classic New York style slice",
    price: 180,
    category: "desserts",
    emoji: "🍰"
  }
];

// ------ STATE ------
let activeCategory = "all";
let addedItems = new Set();

// ------ RENDER CARDS ------
function renderCards(items) {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span>☕</span>
        <p>No items in this category yet.</p>
      </div>`;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.style.animationDelay = `${index * 0.06}s`;

    const isAdded = addedItems.has(item.id);

    card.innerHTML = `
      <span class="card-emoji">${item.emoji}</span>
      <div class="card-name">${item.name}</div>
      <div class="card-desc">${item.description}</div>
      <div class="card-price">₹${item.price}</div>
      <button
        class="card-add-btn ${isAdded ? "added" : ""}"
        data-id="${item.id}"
      >${isAdded ? "✓ Added" : "+ Add"}</button>
    `;

    const btn = card.querySelector(".card-add-btn");
    btn.addEventListener("click", () => handleAdd(item.id, btn));

    grid.appendChild(card);
  });
}

// ------ HANDLE ADD BUTTON ------
function handleAdd(id, btn) {
  if (addedItems.has(id)) {
    // Toggle off
    addedItems.delete(id);
    btn.textContent = "+ Add";
    btn.classList.remove("added");
  } else {
    // Toggle on
    addedItems.add(id);
    btn.textContent = "✓ Added";
    btn.classList.add("added");
  }
}

// ------ FILTER ------
function filterItems(category) {
  if (category === "all") return menuItems;
  return menuItems.filter(item => item.category === category);
}

// ------ CATEGORY BUTTONS ------
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Update active
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeCategory = btn.dataset.category;
    renderCards(filterItems(activeCategory));
  });
});

// ------ NAV BUTTONS (visual only) ------
const navBtns = document.querySelectorAll(".nav-btn");

navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ------ FAB PDF (placeholder) ------
document.querySelector(".fab-pdf").addEventListener("click", () => {
  alert("PDF download feature coming soon!");
});

// ------ INITIAL RENDER ------
renderCards(menuItems);
