// -------------------------------------------------------------
// Defines all application routes and protected routes.
// Uses React Router v6 and AuthContext for guarding pages.
// -------------------------------------------------------------

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import NewProject from "../pages/NewProject";
import EditProject from "../pages/EditProject";
import ProjectDetails from "../pages/ProjectDetails";
import Footer from "../components/Footer";

// -----------------------------------------------------------
// ProtectedRoute
//
// Wrapper component that checks authentication before
// rendering protected pages. Redirects to /login if user
// is not authenticated.
// -----------------------------------------------------------
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <BrowserRouter>
      {/* Navbar displayed on all routes */}
      <Navbar />

      <main className="min-h-[80vh]">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <NewProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<div className="p-4">Page not found</div>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRouter;
