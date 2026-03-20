// สถาะลักษณะของเว็บ
import { STORAGE_KEYS, readStoredUser } from "./storage.js";

export const state = {
  token: localStorage.getItem(STORAGE_KEYS.token) || "",
  user: readStoredUser(),
  products: [],
  search: "",
};