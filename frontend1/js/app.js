import { fetchCurrentUser, handleLogin, handleRegister, logout } from "./auth/auth.js";
import { elements } from "./core/elements.js";
import { state } from "./core/state.js";
import { syncAuthUI, toggleAuthForm } from "./core/ui.js";
import { loadInbox } from "./messages/messages.js";
import { handleCreateProduct, handleSearch, loadProducts } from "./products/products.js";

init();

function init() {
  bindEvents();
  syncAuthUI();
  loadProducts();

  if (state.token) {
    fetchCurrentUser().then(() => loadInbox());
  } else {
    loadInbox();
  }
}

function bindEvents() {
  elements.showLogin.addEventListener("click", () => toggleAuthForm("login"));
  elements.showRegister.addEventListener("click", () => toggleAuthForm("register"));
  elements.logoutButton.addEventListener("click", logout);
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);
  elements.productForm.addEventListener("submit", handleCreateProduct);
  elements.searchForm.addEventListener("submit", handleSearch);
  elements.refreshInbox.addEventListener("click", loadInbox);
}
