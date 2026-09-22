

const auth0Config = {
  domain: "dev-idukycf2vrztcw83.us.auth0.com",
  clientId: "2o9nlYPKkze8oMWT2gSsRtHA5QyYPc7b",
  authorizationParams: {
    redirect_uri: window.location.origin + window.location.pathname
  }
};

let auth0Client = null;

async function initAuth0() {
  auth0Client = await auth0.createAuth0Client(auth0Config);

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  await updateAuthUI();
}

async function loginWithAuth0() {
  await auth0Client.loginWithRedirect();
}

async function logoutFromAuth0() {
  
  clearCart();
  renderCart();

  await auth0Client.logout({
    logoutParams: { returnTo: window.location.origin + window.location.pathname }
  });
}

async function isLoggedIn() {
  return auth0Client ? await auth0Client.isAuthenticated() : false;
}

async function getCurrentUser() {
  return auth0Client ? await auth0Client.getUser() : null;
}

async function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeMsg = document.getElementById("welcomeMsg");

  const logged = await isLoggedIn();

  if (logged) {
    const user = await getCurrentUser();
    welcomeMsg.textContent = `Hola, ${user.name || user.nickname || "cliente"} 👋`;
    welcomeMsg.hidden = false;
    loginBtn.hidden = true;
    logoutBtn.hidden = false;
  } else {
    welcomeMsg.hidden = true;
    loginBtn.hidden = false;
    logoutBtn.hidden = true;
  }
}