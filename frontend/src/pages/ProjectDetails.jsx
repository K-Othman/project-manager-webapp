// -------------------------------------------------------------
// Public page that displays full information about a single
// project, including:
//  - Title
//  - Start & end date
//  - Phase
//  - Owner email (required by brief)
//  - Short description
//
// Handles:
//  - Loading state
//  - Error state
//  - "Project not found" state
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Alert from "../components/Alert";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Fetch project details when component mounts / id changes
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await api.get(`/projects/${id}`);

        if (res.data.success) {
          setProject(res.data.project);
        } else {
          setError(res.data.message || "Failed to load project.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Unable to load project.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="card-padded">
          <p className="text-muted">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-container">
        <Alert type="error">{error}</Alert>
        <Link to="/" className="btn-secondary">
          Back to all projects
        </Link>
      </div>
    );
  }

  // Not found state (no error but no project)
  if (!project) {
    return (
      <div className="page-container">
        <div className="card-padded">
          <p className="mb-3">Project not found.</p>
          <Link to="/" className="btn-secondary">
            Back to all projects
          </Link>
        </div>
      </div>
    );
  }

  // Main render: project details
  return (
    <div className="page-container">
      {/* Title + phase badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h1 className="page-title mb-0">{project.title}</h1>

        <span className="badge-pill">
          {project.phase}
        </span>
      </div>

      {/* Metadata card */}
      <div className="card-padded mb-4">
        <h2 className="section-title">Project details</h2>

        <div className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p>
              <span className="font-medium">Start date:</span>{" "}
              {project.start_date}
            </p>
            <p>
              <span className="font-medium">End date:</span>{" "}
              {project.end_date || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Created at:</span>{" "}
              {project.created_at}
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <span className="font-medium">Owner email:</span>{" "}
              <span className="font-mono">{project.owner_email}</span>
            </p>
            {project.username && (
              <p>
                <span className="font-medium">Owner username:</span>{" "}
                {project.username}
              </p>
            )}
            <p>
              <span className="font-medium">Project ID:</span>{" "}
              {project.pid}
            </p>
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className="card-padded">
        <h2 className="section-title">Short description</h2>
        <p className="text-sm text-gray-800">
          {project.short_description}
        </p>
        
          <Link
            to="/"
            className="btn-primary hover:text-white mt-4"
          >
            Browse other projects
          </Link>
      </div>
    </div>
  );
}

export default ProjectDetails;
