// ==========================================
// CONFIGURAÇÕES DO AUTH0
// ==========================================
let auth0Client = null;
const auth0Config = {
  domain: "dev-u82yyb4obc3fmwr5.us.auth0.com",
  client_id: "gDNCR3p6tfk7ym1CCJR2rq42AxLiyb2B"
};

// Inicialização do fluxo do Auth0
async function initAuth0() {
  auth0Client = await createAuth0Client({
    domain: auth0Config.domain,
    client_id: auth0Config.client_id
  });

  // Verifica se o usuário está retornando do login do Auth0
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Altera os botões baseando-se no status de login
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (isAuthenticated) {
    const user = await auth0Client.getUser();
    document.getElementById("btn-login").style.display = "none";
    document.getElementById("btn-logout").style.display = "inline-block";
    const greeting = document.getElementById("user-greeting");
    greeting.style.display = "block";
    greeting.innerText = `Bem-vindo, ${user.name || user.nickname}!`;
  } else {
    document.getElementById("btn-login").style.display = "inline-block";
    document.getElementById("btn-logout").style.display = "none";
    document.getElementById("user-greeting").style.display = "none";
  }
}

// Ouvintes de clique para os botões funcionarem
document.getElementById("btn-login").addEventListener("click", () => {
  auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin + window.location.pathname
    }
  });
});

document.getElementById("btn-logout").addEventListener("click", () => {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin + window.location.pathname
    }
  });
});

// Executa a inicialização do login assim que a página carrega
window.addEventListener("load", async () => {
  await initAuth0();
});
