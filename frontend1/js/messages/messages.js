// เเชทเอาไว้ติดต่อ
import { apiFetch } from "../core/api.js";
import { elements } from "../core/elements.js";
import { state } from "../core/state.js";
import { escapeHtml, showMessage } from "../core/ui.js";

export async function handleSendMessage(product) {
  if (!state.token) {
    showMessage(elements.productsMessage, "Please login before sending a message", "error");
    return;
  }

  const message = window.prompt(`Message to ${product.username || "User"} about "${product.title}"`);
  if (!message || !message.trim()) {
    return;
  }

  try {
    await apiFetch("/messages", {
      method: "POST",
      body: JSON.stringify({
        receiver_id: product.user_id,
        product_id: product.id,
        message: message.trim(),
      }),
    });

    showMessage(elements.productsMessage, "Message sent", "success");
  } catch (error) {
    showMessage(elements.productsMessage, error.message, "error");
  }
}
// inbox
export async function loadInbox() {
  if (!state.user) {
    renderInbox([]);
    showMessage(elements.inboxMessage, "Login to view inbox", "info");
    return;
  }

  showMessage(elements.inboxMessage, "Loading inbox...", "info");

  try {
    const data = await apiFetch(`/messages/user/${state.user.id}`);
    renderInbox(data);
    showMessage(elements.inboxMessage, `Loaded ${data.length} message(s)`, "success");
  } catch (error) {
    renderInbox([]);
    showMessage(elements.inboxMessage, error.message, "error");
  }
}
// สาง inbox มายังเว็บ
export function renderInbox(messages) {
  elements.inboxList.innerHTML = "";

  if (!messages.length) {
    elements.inboxList.innerHTML = '<div class="muted">No inbox messages.</div>';
    return;
  }

  messages.forEach((item) => {
    const card = document.createElement("article");
    card.className = "inbox-card";
    card.innerHTML = `
      <strong>From: ${escapeHtml(item.sender_name || "-")}</strong>
      <p>${escapeHtml(item.message || "")}</p>
      <p class="muted">Product ID: ${item.product_id} | Receiver: ${escapeHtml(
        item.receiver_name || "-"
      )}</p>
    `;
    elements.inboxList.appendChild(card);
  });
}
