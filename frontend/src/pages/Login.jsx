// -------------------------------------------------------------
// Public login page with minimal client-side validation:
//  - Username/email is required
//  - Password is required
// Shows simple error / success messages using <Alert />.
// -------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Minimal client-side validation
    if (!usernameOrEmail.trim() || !password.trim()) {
      setError("Please enter both your username/email and password.");
      return;
    }

    const res = await login(usernameOrEmail.trim(), password);

    if (!res.success) {
      setError(res.message || "Login failed.");
    } else {
      setSuccess("Logged in successfully.");
      setTimeout(() => navigate("/dashboard"), 800);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card-padded w-full max-w-md">
        <h1 className="text-xl font-semibold mb-2 text-center">Login</h1>
        <p className="text-muted text-center mb-4">
          Sign in to manage your projects.
        </p>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Username or Email</label>
            <input
              className="form-input"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
