// -------------------------------------------------------------
// Protected page that shows projects belonging to the
// currently authenticated user.
//
// Features:
//  - Fetches /api/projects/mine/list on mount
//  - Lists user's projects with quick View/Edit actions
//  - Provides button to create a new project
//  - Clean, consistent layout using shared Tailwind tokens
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Alert from "../components/Alert";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  // Which project is in "confirm delete?" state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Load current user's projects when the page mounts
  useEffect(() => {
    async function fetchMyProjects() {
      try {
        const res = await api.get("/projects/mine/list");

        if (res.data.success) {
          setProjects(res.data.projects || []);
        } else {
          setError(res.data.message || "Failed to load projects.");
        }
      } catch (err) {
        console.error("Error loading my projects:", err);
        setError("Unable to load your projects.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyProjects();
  }, []);

  async function handleDelete(pid) {
    try {
      const res = await api.delete(`/projects/${pid}`);

      if (res.data.success) {
        // Remove the deleted item locally
        setProjects((prev) => prev.filter((p) => p.pid !== pid));

        setToast("Project deleted successfully.");
        setToastType("success");
      } else {
        setToast(res.data.message || "Failed to delete project.");
        setToastType("error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setToast("Error deleting project.");
      setToastType("error");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="page-container">
      {/* Header area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div>
          <h1 className="page-title mb-1">My Projects</h1>
          <p className="text-muted">
            Manage the projects that belong to your account.
          </p>
        </div>

        <Link
          to="/projects/new"
          className="btn-primary hover:text-white"
        >
          + New Project
        </Link>
      </div>

      {/* Toast message (non-blocking) */}
      {toast && <Alert type={toastType}>{toast}</Alert>}

      {/* Error message, if any */}
      {error && (
        <div className="card-padded mb-4 border-red-200 bg-red-50 text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="card-padded">
          <p className="text-muted">Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        // Empty state when user has no projects
        <div className="card-padded text-center">
          <p className="mb-2 font-medium">
            You don&apos;t have any projects yet.
          </p>
          <p className="text-muted mb-4">
            Create your first project to get started.
          </p>
          <Link to="/projects/new" className="btn-primary hover:text-white">
            Create a project
          </Link>
        </div>
      ) : (
        // List of user's projects
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.pid}
              className="card-padded flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <h2 className="text-lg font-semibold mb-1">{p.title}</h2>
                <p className="text-sm text-gray-500">
                  Start: {p.start_date} · Phase: {p.phase}
                </p>
              </div>

              <div className="flex gap-2 text-sm">
                <Link
                  to={`/project/${p.pid}`}
                  className="btn-secondary"
                >
                  View
                </Link>
                <Link
                  to={`/projects/${p.pid}/edit`}
                  className="btn-primary hover:text-white"
                >
                  Edit
                </Link>

                {confirmDeleteId === p.pid ? (
                  <>
                    <button
                      onClick={() => handleDelete(p.pid)}
                      className="btn-danger"
                    >
                      Confirm delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(p.pid)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
