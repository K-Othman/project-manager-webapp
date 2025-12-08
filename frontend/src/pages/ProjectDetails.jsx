// -------------------------------------------------------------
// Public page that displays full information about a single 
// project, including owner email (as required by the brief).
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectDetails() {
  const { id } = useParams(); // project ID from URL

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch single project details
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

  if (loading) {
    return <div className="p-4">Loading project...</div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        Project not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">{project.title}</h1>

      <p className="text-sm text-gray-600 mb-4">
        Owner email: <span className="font-mono">{project.owner_email}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p>
            <strong>Start date:</strong> {project.start_date}
          </p>
          <p>
            <strong>End date:</strong> {project.end_date || "Not specified"}
          </p>
        </div>
        <div>
          <p>
            <strong>Phase:</strong> {project.phase}
          </p>
          <p>
            <strong>Created at:</strong> {project.created_at}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h2 className="font-semibold mb-2">Short Description</h2>
        <p className="text-gray-800">
          {project.short_description}
        </p>
      </div>
    </div>
  );
}

export default ProjectDetails;
