// -------------------------------------------------------------
// React Context for managing authentication state.
// Responsibilities:
//  - Stores user information and JWT token
//  - Persists auth data in localStorage
//  - Exposes login, register, and logout helpers
//
// Security:
//  - Token stored in localStorage for simplicity (acceptable for this project)
//  - Authorization header is attached by axios interceptor
// -------------------------------------------------------------

import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // Authenticated user object
  const [token, setToken] = useState(null);   // JWT token
  const [loading, setLoading] = useState(true); // Initial loading state

  // -----------------------------------------------------------
  // Load any existing user + token from localStorage on mount
  // -----------------------------------------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // If parsing fails, clear invalid data
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // -----------------------------------------------------------
  // Login handler
  //
  // Calls backend /api/auth/login and, on success:
  //  - Stores user and token in state
  //  - Persists them in localStorage
  // -----------------------------------------------------------
  async function login(usernameOrEmail, password) {
  try {
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
  } catch (err) {
    console.error("Login error:", err);

    // If backend sent a structured error, reuse it
    if (err.response?.data) {
      return err.response.data;
    }

    return {
      success: false,
      message: "Unable to login. Please try again.",
    };
  }
}

  // -----------------------------------------------------------
  // Register handler
  //
  // Calls backend /api/auth/register and auto-logs in on success.
  // -----------------------------------------------------------
  async function register(username, email, password) {
  try {
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
  } catch (err) {
    console.error("Registration error:", err);

    if (err.response?.data) {
      return err.response.data;
    }

    return {
      success: false,
      message: "Unable to register. Please try again.",
    };
  }
}

  // -----------------------------------------------------------
  // Logout handler
  //
  // Clears auth state and removes localStorage entries.
  // -----------------------------------------------------------
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

// Custom hook for easier consumption in components
export function useAuth() {
  return useContext(AuthContext);
}
