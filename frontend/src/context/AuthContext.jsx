import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // wait to check localStorage

  // On app load, restore user from localStorage if token exists
  useEffect(() => {
    const saved = localStorage.getItem("mkUser");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  // ── Login: calls real backend ──────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      // Save token and user to localStorage so refresh keeps you logged in
      localStorage.setItem("mkToken", data.token);
      localStorage.setItem("mkUser", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── Register: calls real backend ───────────────────────────────────────
  const register = async (formData) => {
    try {
      await authAPI.register(formData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("mkToken");
    localStorage.removeItem("mkUser");
    setUser(null);
  };

  if (loading) return null; // don't render until we know auth state

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
