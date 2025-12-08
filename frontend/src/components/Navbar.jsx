// -------------------------------------------------------------
// Top navigation bar displayed on all pages.
// - Shows different links depending on authentication state
// - Provides quick access to Projects, Dashboard, Login/Register
// -------------------------------------------------------------

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white border-b shadow-sm">
  <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
    {/* Brand / Home link */}
    <Link to="/" className="font-semibold text-lg">
      <span className="text-blue-600">Project </span>
      <span className="text-gray-900">Manager</span>
    </Link>

    {/* Right-side navigation */}
    <div className="
      flex flex-wrap items-center text-sm divide-x divide-gray-200">
      {/* Projects */}
      <Link
        to="/"
        className="px-3 py-1 hover:text-blue-600"
      >
        Projects
      </Link>

      {isAuthenticated ? (
        <>
          <Link
            to="/dashboard"
            className="px-3 py-1 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            to="/projects/new"
            className="px-3 py-1 hover:text-blue-600"
          >
            New Project
          </Link>

          {/* Username */}
          <span className="px-3 py-1 text-gray-500">
            {user?.username}
          </span>

          {/* Logout button */}
          <button
            onClick={logout}
            className="px-3 py-1 text-gray-700 hover:text-blue-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="px-3 py-1 hover:text-blue-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-3 py-1 hover:text-blue-600"
          >
            Register
          </Link>
        </>
      )}
    </div>
  </div>
</nav>

  );
}

export default Navbar;
