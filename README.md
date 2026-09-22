SportyStyle Documento Explicativo
Mini tienda virtual que simula selección de productos,
autenticación con Auth0 y carrito de compras en Session Storage.
Estructura

sportystyle
 index.html   Catálogo, carrito, formulario de pago, confirmación
 style.css      Estilos
 cart.js          Catálogo de productos + lógica del carrito
 auth.js            Integración con Auth0
 app.js                Conecta los botones con cart.js y auth.js
 imágenes                6 fotos de productos

1. Flujo de autenticación (Auth0)
initAuth0() crea el cliente de Auth0 con el domain y clientId de la app registrada,
y detecta si la URL trae los parámetros de un login recién hecho para completarlo con
handleRedirectCallback(). loginWithAuth0() llama a loginWithRedirect() para mandar
al usuario a la pantalla de Auth0. logoutFromAuth0() cierra la sesión y además vacía el
carrito (clearCart) + renderCart(). updateAuthUI() usa isAuthenticated() y
getUser() para mostrar el mensaje de bienvenida o el botón de login. El botón Ir a
pagar verifica isLoggedIn() antes de abrir el formulario.
En ningún momento se lee o guarda manualmente el token JWT: esa gestión queda
delegada por completo al SDK de Auth0.
3. Selección de productos y carrito
El catálogo (6 productos en 3 categorías: camisetas, pantalones, accesorios) está en
index.html, cada uno con imagen, nombre, descripción, precio y un botón
.agregar-carrito con data-id. Ese mismo id está en el arreglo PRODUCTS de cart.js.
Al hacer clic, addToCart(id) agrega el producto o aumenta su cantidad si ya estaba.
changeQuantity() maneja los botones +/− (y elimina el producto si llega a 0).
renderCart() redibuja la lista, el total y la cantidad cada vez que el carrito cambia.
4. Protección de la sesión con Session Storage
Se usa sessionStorage (no localStorage) porque el carrito debe existir solo mientras
la sesión del navegador está activa. getCart()/saveCart() leen y escriben el carrito
como JSON bajo la clave sportystyle_cart. Los datos se eliminan por completo con
clearCart() en dos momentos: al cerrar sesión (logoutFromAuth0()) y al confirmar
una compra en app.js, tras mostrar ¡Gracias por tu compra!. Además, sessionStorage
se borra solo si se cierra la pestaña o el navegador.
Validaciones del formulario de pago
Antes de confirmar la compra se valida: correo (regex que exige @ + dominio, ej.
nombre@gmail.com) y teléfono (regex que solo acepta 8-9 dígitos numéricos). Si algún
campo falla, se muestra una alerta y no se avanza a la confirmación.
