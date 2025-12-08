// -------------------------------------------------------------
// Public login page.
// - Uses AuthContext to perform login
// - On success, redirects user to the dashboard
// - Displays error messages returned from backend
// -------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // -----------------------------------------------------------
  // Submit login form
  // -----------------------------------------------------------
  async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  const res = await login(usernameOrEmail, password);

  if (!res.success) {
    setError(res.message || "Login failed.");
  } else {
    navigate("/dashboard");
  }
}

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card-padded w-full max-w-md">
        <h1 className="text-xl font-semibold mb-2 text-center">Login</h1>
        <p className="text-muted text-center mb-4">
          Sign in to manage your projects.
        </p>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Username or Email</label>
            <input
              className="form-input"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
