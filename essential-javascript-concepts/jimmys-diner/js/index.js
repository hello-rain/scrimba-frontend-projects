import menuArray from "../data.js";

// Cart array to store selected menu items
let cart = [];

document.addEventListener("DOMContentLoaded", function () {
  renderMenu();
  setupEventListeners();
});

function renderMenu() {
  const menuContainer = document.querySelector(".menu .container");
  menuContainer.innerHTML = ""; // Clear previous menu items

  menuArray.forEach((item) => {
    // Render a menu item
    const menuItem = document.createElement("article");
    menuItem.classList.add("menu__item");
    menuItem.setAttribute("data-id", item.id);

    let menuItemImg = document.createElement("img");

    menuItemImg.src = `./static/images/${item.name.toLowerCase()}.png`;

    // If the image fails to load, hide the element to avoid broken image icon.
    menuItemImg.onerror = () => {
      menuItemImg.style.display = "none";
    };
    menuItemImg.alt = item.name;

    const menuItemInfo = document.createElement("div");
    menuItemInfo.classList.add("menu__item-info");

    const menuItemTitle = document.createElement("h3");
    menuItemTitle.classList.add("menu__item-title");
    menuItemTitle.textContent = item.name;

    const menuItemIngredients = document.createElement("span");
    menuItemIngredients.classList.add("menu__item-ingredients");
    menuItemIngredients.textContent = item.ingredients;

    const menuItemPrice = document.createElement("span");
    menuItemPrice.classList.add("menu__item-price");
    menuItemPrice.textContent = `$${item.price}`;

    const menuItemBtn = document.createElement("button");
    menuItemBtn.classList.add("menu__item-btn", "text-right");
    menuItemBtn.textContent = "+";
    menuItemBtn.setAttribute("data-id", item.id); // Store ID for event handling

    menuItemInfo.append(menuItemTitle, menuItemIngredients, menuItemPrice);
    menuItem.append(menuItemImg, menuItemInfo, menuItemBtn);
    menuContainer.append(menuItem);
  });
}

function updateCart(item, action) {
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.id === item.id
  );
  if (action === "add") {
    if (existingItemIndex > -1) {
      // cart[existingItemIndex].quantity++; (optional)
    } else {
      cart.push(item);
    }
  } else if (action === "remove") {
    if (existingItemIndex > -1) {
      cart.splice(existingItemIndex, 1);
    }
  }

  renderCart();
}

function renderCart() {
  // Create order HTML structure
  const cartList = document.querySelector(".cart__list");
  cartList.textContent = "";

  if (cart.length > 0) {
    toggleModal(".cart");

    cart.forEach((cartItem) => {
      const cartListItem = document.createElement("li");
      cartListItem.classList.add("cart__list-item");

      const cartListTitle = document.createElement("span");
      cartListTitle.classList.add("cart__list-title");
      cartListTitle.textContent = cartItem.name;

      const cartListBtn = document.createElement("button");
      cartListBtn.classList.add("cart__list-btn");
      cartListBtn.textContent = "remove";
      cartListBtn.setAttribute("data-id", cartItem.id); // Store ID for event handling

      const cartListPrice = document.createElement("span");
      cartListPrice.classList.add("cart__list-price", "text-right");
      cartListPrice.textContent = `$${cartItem.price}`;

      cartListItem.append(cartListTitle, cartListBtn, cartListPrice);

      cartList.append(cartListItem);

      updateTotalPrice();
    });
  }
}

function updateTotalPrice() {
  let total = 0;
  cart.forEach((item) => (total += item.price));
  document.querySelector(".cart__total-price").textContent = `$${total}`;
}

function setupEventListeners() {
  const addButtons = document.querySelectorAll(".menu__item-btn");
  const removeButtons = document.querySelectorAll(".cart__list-btn");
  const completeButton = document.querySelector("#complete-btn");
  const modalForm = document.querySelector("#modal__form");

  addButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id");
      const item = menuArray.find((item) => item.id == itemId);
      updateCart(item, "add");
    });
  });

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id");
      const item = cart.find((item) => item.id === itemId);
      updateCart(item, "remove");
    });
  });

  completeButton.addEventListener("click", () => toggleModal(".modal"));
  modalForm.addEventListener("submit", (event) => validatePayment(event));
}

function toggleModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  if (!modal) {
    console.error(`❌ Error: Element '${modalSelector}' not found.`);
    return;
  }
  modal.classList.toggle("active");
}

function resetCart() {
  cart = [];
}

function validatePayment(event) {
  event.preventDefault();
  const form = event.target;
  if (form.checkValidity()) {
    console.log("Payment is valid! Processing...");

    const customerName = document.querySelector("#card-name").value; // ✅ Store value before reset

    form.reset(); // 🔄 Clear the form after storing values

    resetCart();
    toggleModal(".modal");
    toggleModal(".cart");

    renderSuccessMessage(customerName); // ✅ Pass the stored name
  } else {
    console.log("Invalid payment details!");
    form.reportValidity(); // Show browser validation messages
  }
}

function renderSuccessMessage(name) {
  document.querySelector("#customer-name").textContent = name;
  toggleModal(".complete-message");
}
