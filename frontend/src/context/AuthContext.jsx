/**
 * AuthContext
 *
 * Provides authentication state and helpers to the entire app.
 * - Stores user and token
 * - Persists token in localStorage
 * - Exposes login, logout, and register functions
 */

import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      
  const [token, setToken] = useState(null);    
  const [loading, setLoading] = useState(true);

  // Load stored token on first render
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  /**
   * Handle login using API.
   * Expects backend response: { success, user, token }
   */
  async function login(usernameOrEmail, password) {
    const response = await api.post("/auth/login", {
      usernameOrEmail,
      password,
    });

    if (response.data.success) {
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    }

    return response.data;
  }

  /**
   * Handle registration using API.
   */
  async function register(username, email, password) {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    if (response.data.success) {
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    }

    return response.data;
  }

  /**
   * Clear user session.
   */
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
