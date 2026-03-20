// เก็บข้อมูลของ login
export const STORAGE_KEYS = {
  token: "token",
  user: "user",
};

export function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null");
  } catch {
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
}

export function saveAuth(token, user) {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}