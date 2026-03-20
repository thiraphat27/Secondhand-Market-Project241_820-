import { state } from "./state.js";

const configuredApiBase = document
  .querySelector('meta[name="api-base"]')
  ?.getAttribute("content")
  ?.trim();

const API_BASE =
  configuredApiBase ||
  (window.location.port === "5000"
    ? `${window.location.origin}/api`
    : "http://localhost:5000/api");

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
