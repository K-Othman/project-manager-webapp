// -------------------------------------------------------------
// Public page that displays full information about a single 
// project, including owner email (required by the brief).
//
// Notes:
//  - Read-only view, safe for public access
//  - Authenticated users can still edit via Dashboard/Edit page
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectDetails() {
  // Extract project ID from the URL
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // -----------------------------------------------------------
  // Fetch project details when component mounts or ID changes
  // -----------------------------------------------------------
  useEffect(() => {
    async function loadProject() {
      try {
        const response = await api.get(`/projects/${id}`);

        if (response.data.success) {
          setProject(response.data.project);
        } else {
          setError(response.data.message || "Failed to load project.");
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

  // -----------------------------------------------------------
  // Render: loading / error / not found states
  // -----------------------------------------------------------
  if (loading) {
    return (
      <div className="page-container">
        <div className="card-padded">
          <p className="text-muted">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card-padded border-red-200 bg-red-50 text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-container">
        <div className="card-padded">
          <p>Project not found.</p>
          <Link to="/" className="btn-secondary mt-3 inline-flex">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // Render: project details
  // -----------------------------------------------------------
  return (
    <div className="page-container">
      {/* Title + phase badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h1 className="page-title mb-0">{project.title}</h1>
        <span className="badge-pill">
          {project.phase}
        </span>
      </div>

      {/* Meta information card */}
      <div className="card-padded mb-4">
        <h2 className="section-title">Project details</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p>
              <span className="font-medium">Start date:</span>{" "}
              {project.start_date}
            </p>
            <p>
              <span className="font-medium">End date:</span>{" "}
              {project.end_date || "Not specified"}
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
              <span className="font-medium">Created at:</span>{" "}
              {project.created_at}
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

        <div className="mt-4">
          <Link to="/" className="btn-secondary">
            Back to all projects
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
