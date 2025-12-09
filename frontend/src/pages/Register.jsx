// -------------------------------------------------------------
// Public registration page with minimal validation:
//  - Username required (≥ 3 chars)
//  - Email required + must contain "@"
//  - Password required (≥ 6 chars)
// Shows simple error / success messages.
// -------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const newErrors = {};

    const trimmedUsername = username.trim();
    const trimmedEmail    = email.trim();

    // Username
    if (!trimmedUsername) {
      newErrors.username = "Username is required.";
    } else if (trimmedUsername.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    // Email (very simple validation)
    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!trimmedEmail.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    const res = await register(trimmedUsername, trimmedEmail, password);

    if (!res.success) {
      setError(res.message || "Registration failed.");
    } else {
      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card-padded w-full max-w-md">
        <h1 className="text-xl font-semibold mb-2 text-center">Register</h1>
        <p className="text-muted text-center mb-4">
          Create an account to manage your projects.
        </p>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Username</label>
            <input
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {fieldErrors.username && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
