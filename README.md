 SportyStyle Documento Explicativo



Unidad 2: Programación segura. Mini tienda virtual que simula selección de productos,
autenticación con Auth0 y carrito de compras en Session Storage.

 Estructura del proyecto

sportystyle
 index.html       Estructura de la tienda: catálogo, carrito, formulario de pago, confirmación
 style.css         Estilos visuales
 cart.js             Catálogo de productos y lógica del carrito 
 auth.js               Integración con Auth0 
app.js                  Conecta los botones de la página con las funciones de cart.js y auth.js
 imagenes
    camiseta_1.jpg
   camiseta_2.jpg
    pantalon_1.jpg
    pantalon_2.jpg
    cinta_para_el_pelo.jpg
    botella.jpg


 1. Flujo de autenticación (Auth0)

initAuth0 crea el cliente de Auth0 con el domain y el clientId de la
aplicación registrada en el panel de Auth0. También revisa si la URL contiene los parámetros que indican que Auth0 acaba de redirigir de vuelta tras un login.

loginWithAuth0 se ejecuta al hacer clic en Iniciar sesión y llama a
  loginWithRedirect, que envía al usuario a la pantalla de login de Auth0.
logoutFromAuth0 se ejecuta al hacer clic en Cerrar sesión. Antes de cerrar la
  sesión en Auth0, vacía el carrito llamando a clearCart y vuelve a
  dibujar el carrito con renderCart, de modo que los datos de Session Storage queden
eliminados.
updateAuthUIconsulta isAuthenticated y getUser del SDK para mostrar el
  mensaje de bienvenida con el nombre del usuario autenticado, o los botones de Iniciar
  sesión si no hay sesión activa.
- El botón Ir a pagar llama a isLoggedIn antes de abrir el formulario
  de pago: si el usuario no ha iniciado sesión, se le avisa que debe hacerlo primero.

En ningún punto del código se lee, decodifica o guarda manualmente el token JWT: esa
gestión queda delegada por completo al SDK de Auth0, tal como pide la actividad.

 2. Proceso de selección de productos y carrito

 El catálogo está definido directamente en index.html: 6 productos repartidos en las tres categorías pedidas (camisetas deportivas pantalones deportivos y accesorios de deporte), cada uno con imagen, nombre, descripción y precio. Cada producto tiene un botón.agregar-carrito con un atributo data-id que lo identifica.

Ese mismo id está replicado en el arreglo PRODUCTS de cart.js, que guarda nombre y
precio de cada producto para poder calcularlos al momento de agregarlos al carrito.
En app.js, la función wireAddToCartButtons agrega un listener a cada botón
  .agregar-carrito al hacer clic, se llama a addToCart(id).
addToCart(productId) (en cart.js) busca el producto en PRODUCTS, revisa si ya
  está en el carrito (en cuyo caso solo aumenta la cantidad) o lo agrega como nuevo ítem, y
  guarda el carrito actualizado.
changeQuantity(productId, delta) permite subir o bajar la cantidad con los botones
  + / − que aparecen junto a cada producto dentro del carrito; si la cantidad llega a 0,
  el producto se elimina del carrito.
renderCart se ejecuta cada vez que el carrito cambia: recorre los productos
  guardados y actualiza en pantalla la lista de ítems, el total (getCartTotal) y la
  cantidad total de productos (getCartCount), mostrada en el ícono del carrito.

3. Protección de la sesión con Session Storage

Se eligió sessionStorage en vez de localStorage porque el carrito debe existir
únicamente mientras la sesión del navegador está activa, tal como pide la actividad

getCart y saveCart (en cart.js) leen y escriben el arreglo del carrito
  en sessionStorage, bajo la clave sportystyle_cart, serializado como JSON con
  JSON.stringify() / JSON.parse().
Cada vez que se agrega un producto o se cambia su cantidad, el carrito se guarda de
  nuevo en Session Storage y la interfaz se actualiza al instante con renderCart, por
  lo que el carrito se mantiene incluso si el usuario navega entre secciones de la misma
  página.
Los datos se eliminan por completo en dos momentos, ambos usando clearCart
  que ejecuta sessionStorage.removeItem(sportystyle_cart):
  1. Al cerrar sesión, dentro de logoutFromAuth0 en auth.js.
  2. Al confirmar una compra, dentro del listener submit del formulario de pago en
     app.js, justo después de mostrar la pantalla de ¡Gracias por tu compra!.
 Adicionalmente, sessionStorage se borra solo si el usuario cierra la pestaña o el
  navegador, reforzando que el carrito nunca sobrevive más allá de la sesión en curso.

 Validaciones del formulario de pago

En app.js, antes de procesar la compra se valida:

Correo: expresión regular EMAIL_REGEX que exige un @ seguido de un dominio con
  punto (ej. nombre@gmail.com).
Teléfono: expresión regular PHONE_REGEX que solo acepta entre 8 y 9 dígitos
 numéricos, sin espacios ni símbolos.

Si algún campo no es válido, se muestra una alerta indicando el error y no se avanza a la
pantalla de confirmación hasta que los datos sean correctos.
