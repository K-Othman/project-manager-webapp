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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Home link */}
        <Link to="/" className="font-semibold text-lg">
          ProjectManager
        </Link>

        {/* Right-side navigation */}
        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-blue-600">
            Projects
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/projects/new" className="hover:text-blue-600">
                New Project
              </Link>

              {/* Show logged-in username */}
              <span className="text-gray-500">
                {user?.username}
              </span>

              {/* Logout button */}
              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
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
