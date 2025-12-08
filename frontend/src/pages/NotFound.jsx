// -------------------------------------------------------------
// Custom 404 page for unknown routes.
// - Shows a simple emoji illustration
// - Message explaining the page does not exist
// - Button to navigate back to the home page
// -------------------------------------------------------------

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card-padded w-full max-w-md text-center">
        {/* Emoji illustration */}
        <div className="text-5xl mb-3">😕</div>

        <h1 className="text-xl font-semibold mb-2">
          This page doesn&apos;t exist
        </h1>

        <p className="text-muted mb-4">
          The page you&apos;re looking for may have been moved, deleted, or
          never existed.
        </p>

        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
