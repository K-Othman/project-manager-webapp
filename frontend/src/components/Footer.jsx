// -------------------------------------------------------------
// Simple, clean footer displayed across the entire website.
// - Uses dynamic year so it never needs updating manually
// - Contains quick navigation links for UX consistency
// - Minimal, unobtrusive design suited for dashboard-style apps
// -------------------------------------------------------------

import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">

        {/* Left section: branding */}
        <p className="mb-2 md:mb-0">
          © {currentYear} ProjectManager. All rights reserved.
        </p>

        <p>Made With Love By Karim</p>

        {/* Right section: quick navigation */}
        <div className="flex gap-4">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/projects/new" className="hover:text-blue-600">
            New Project
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
