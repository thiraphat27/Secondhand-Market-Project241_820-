import { useEffect, useState } from "react";
import api from "../lib/api";
import { AuthContext } from "./authContextValue";

const STORAGE_KEYS = {
  token: "token",
  user: "user",
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.user);
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(token));

  useEffect(() => {
    const syncAuth = async () => {
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.data.user));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.user);
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    syncAuth();
  }, [token]);

  const persistAuth = (nextToken, nextUser) => {
    localStorage.setItem(STORAGE_KEYS.token, nextToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);
    persistAuth(response.data.token, response.data.user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    persistAuth(response.data.token, response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setToken(null);
    setUser(null);
  };

  const value = {
    isAuthenticated: Boolean(token && user),
    isAuthLoading,
    login,
    logout,
    register,
    token,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
