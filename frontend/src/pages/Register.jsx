// -------------------------------------------------------------
// Public registration page.
// - Uses AuthContext to register a new user
// - On success, auto-logs in and redirects to dashboard
// -------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const [error, setError]       = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  // -----------------------------------------------------------
  // Submit registration form
  // -----------------------------------------------------------
  async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  const res = await register(username, email, password);

  if (!res.success) {
    setError(res.message || "Registration failed.");
  } else {
    navigate("/dashboard");
  }
}

  return (
    <div className="flex justify-center items-center min-h-[70vh] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Register</h1>

        {/* Error message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
