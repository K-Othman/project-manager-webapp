// -------------------------------------------------------------
// Centralised Axios instance for all API requests.
// - Sets the base URL from environment variables
// - Automatically attaches JWT token (if present) to requests
// - Keeps HTTP configuration consistent across the app
// -------------------------------------------------------------

import axios from "axios";

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor:
// - Reads JWT token from localStorage
// - Adds Authorization header when user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
