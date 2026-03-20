import { apiFetch } from "../core/api.js";
import { elements } from "../core/elements.js";
import { state } from "../core/state.js";
import { clearStoredAuth, saveAuth } from "../core/storage.js";
import { showMessage, syncAuthUI } from "../core/ui.js";
import { loadInbox, renderInbox } from "../messages/messages.js";

export async function fetchCurrentUser() {
  try {
    const data = await apiFetch("/auth/me");
    state.user = data.user;
    saveAuth(state.token, data.user);
    syncAuthUI();
  } catch (error) {
    clearAuth();
    syncAuthUI();
    showMessage(elements.authMessage, error.message, "error");
  }
}

export async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    persistAuth(data.token, data.user);
    form.reset();
    showMessage(elements.authMessage, data.message, "success");
    await loadInbox();
  } catch (error) {
    showMessage(elements.authMessage, error.message, "error");
  }
}

export async function handleRegister(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    persistAuth(data.token, data.user);
    form.reset();
    showMessage(elements.authMessage, data.message, "success");
    await loadInbox();
  } catch (error) {
    showMessage(elements.authMessage, error.message, "error");
  }
}

export function persistAuth(token, user) {
  state.token = token;
  state.user = user;
  saveAuth(token, user);
  syncAuthUI();
}

export function clearAuth() {
  state.token = "";
  state.user = null;
  clearStoredAuth();
}

export function logout() {
  clearAuth();
  syncAuthUI();
  renderInbox([]);
  showMessage(elements.authMessage, "Logged out", "info");
  showMessage(elements.inboxMessage, "Login to view inbox", "info");
}
