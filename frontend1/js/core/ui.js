import { elements } from "./elements.js";
import { state } from "./state.js";

export function toggleAuthForm(mode) {
  const loginActive = mode === "login";
  elements.loginForm.classList.toggle("hidden", !loginActive);
  elements.registerForm.classList.toggle("hidden", loginActive);
  elements.showLogin.classList.toggle("active", loginActive);
  elements.showRegister.classList.toggle("active", !loginActive);
  showMessage(elements.authMessage, "", "info");
}

export function syncAuthUI() {
  const isLoggedIn = Boolean(state.token && state.user);
  elements.logoutButton.classList.toggle("hidden", !isLoggedIn);
  elements.authStatus.textContent = isLoggedIn
    ? `Login: ${state.user.username} (#${state.user.id})`
    : "Guest";
}

export function showMessage(target, text, type) {
  if (!text) {
    target.className = "message hidden";
    target.textContent = "";
    return;
  }

  target.className = `message ${type}`;
  target.textContent = text;
}

export function makeButton(label, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

export function formatPrice(price) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
