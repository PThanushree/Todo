import { createContext, useContext, useState, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("todo_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("todo_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("todo_token", nextToken);
    localStorage.setItem("todo_user", JSON.stringify(nextUser));
  };

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();
    if (!body.success) throw new Error(body.message);
    persist(body.data.token, body.data.user);
  }, []);

  const register = useCallback(async (username, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const body = await res.json();
    if (!body.success) throw new Error(body.message);
    persist(body.data.token, body.data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("todo_token");
    localStorage.removeItem("todo_user");
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
