

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[0-9]{8,9}$/;

function wireAddToCartButtons() {
  document.querySelectorAll(".agregar-carrito").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function wireCartQuantityButtons() {
  document.getElementById("cartItems").addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const delta = btn.dataset.action === "inc" ? 1 : -1;
    changeQuantity(btn.dataset.id, delta);
  });
}

function wireCartButton() {
 
  document.getElementById("cartBtn").addEventListener("click", () => {
    document.querySelector(".carrito").scrollIntoView({ behavior: "smooth" });
  });
}

function wireAuthButtons() {
  document.getElementById("loginBtn").addEventListener("click", loginWithAuth0);
  document.getElementById("logoutBtn").addEventListener("click", logoutFromAuth0);
}

function wireCheckoutFlow() {
  const checkoutModal = document.getElementById("checkoutModal");
  const confirmationModal = document.getElementById("confirmationModal");
  const checkoutForm = document.getElementById("checkoutForm");

  document.getElementById("checkoutBtn").addEventListener("click", async () => {
    if (await isLoggedIn()) {
      checkoutModal.hidden = false;
    } else {
      alert("Debes iniciar sesión antes de completar tu compra.");
    }
  });

  document.getElementById("checkoutCancelBtn").addEventListener("click", () => {
    checkoutModal.hidden = true;
  });

  checkoutForm.addEventListener("submit", e => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (fullName.length < 3) return alert("Ingresa tu nombre completo.");
    if (address.length < 5) return alert("Ingresa una dirección válida.");
    if (!EMAIL_REGEX.test(email)) return alert("Ingresa un correo válido, ej: nombre@gmail.com");
    if (!PHONE_REGEX.test(phone)) return alert("Ingresa solo números (8 a 9 dígitos).");

    const cart = getCart();
    const resumen = cart.map(i => `${i.nombre} x${i.cantidad}`).join(", ");
    document.getElementById("confDetails").textContent =
      `${fullName}, tu pedido (${resumen}) por ${formatCLP(getCartTotal(cart))} va en camino a ${address}.`;

    checkoutModal.hidden = true;
    confirmationModal.hidden = false;

    clearCart();
    renderCart();
    checkoutForm.reset();
  });

  document.getElementById("confCloseBtn").addEventListener("click", () => {
    confirmationModal.hidden = true;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  wireAddToCartButtons();
  wireCartQuantityButtons();
  wireCartButton();
  wireAuthButtons();
  wireCheckoutFlow();
  renderCart();
  await initAuth0();
});