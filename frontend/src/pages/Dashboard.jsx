// -------------------------------------------------------------
// Protected page that shows projects belonging to the
// currently authenticated user.
//
// Features:
//  - Fetches /api/projects/mine/list
//  - Lists user's projects with quick View/Edit actions
//  - Provides button to create a new project
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Load current user's projects
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

  if (loading) {
    return <div className="p-4">Loading your projects...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header area */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Link
          to="/projects/new"
          className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          + New Project
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {/* Projects list */}
      {projects.length === 0 ? (
        <p>You have no projects yet.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.pid}
              className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm"
            >
              <div>
                <h2 className="font-semibold text-lg">{p.title}</h2>
                <p className="text-sm text-gray-500">
                  Start: {p.start_date} · Phase: {p.phase}
                </p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0 text-sm">
                <Link
                  to={`/project/${p.pid}`}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                >
                  View
                </Link>
                <Link
                  to={`/projects/${p.pid}/edit`}
                  className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
