

const PRODUCTS = [
  { id: "cam-01", nombre: "Camiseta Básica Negra", precio: 12990 },
  { id: "cam-02", nombre: "Camiseta Training blanca", precio: 15990 },
  { id: "pan-01", nombre: "Jogger Gris Confort", precio: 21990 },
  { id: "pan-02", nombre: "Pantalón Training Azul", precio: 24990 },
  { id: "acc-01", nombre: "Cinta para el Pelo", precio: 4990 },
  { id: "acc-02", nombre: "Botella Deportiva 750ml", precio: 6990 }
];

const CART_KEY = "sportystyle_cart";

function formatCLP(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function getCart() {
  const raw = sessionStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  sessionStorage.removeItem(CART_KEY);
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({ id: product.id, nombre: product.nombre, precio: product.precio, cantidad: 1 });
  }

  saveCart(cart);
  renderCart();
}

function changeQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.cantidad += delta;
  const updated = item.cantidad > 0 ? cart : cart.filter(i => i.id !== productId);

  saveCart(updated);
  renderCart();
}

function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.cantidad, 0);
}

function renderCart() {
  const cart = getCart();
  const list = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("cartEmpty");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  list.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
    cart.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.nombre} (${formatCLP(item.precio)} c/u)</span>
        <span>
          <button data-action="dec" data-id="${item.id}">−</button>
          ${item.cantidad}
          <button data-action="inc" data-id="${item.id}">+</button>
        </span>
      `;
      list.appendChild(li);
    });
  }

  totalEl.textContent = formatCLP(getCartTotal(cart));
  countEl.textContent = getCartCount(cart);
  checkoutBtn.disabled = cart.length === 0;
}