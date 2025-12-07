import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.data.success) {
          setProject(res.data.project);
        } else {
          setError(res.data.message || "Failed to load project.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load project.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
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
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>

      <p className="text-sm text-gray-600 mb-2">
        Owner email: <span className="font-mono">{project.owner_email}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p>
            <span className="font-semibold">Start date:</span>{" "}
            {project.start_date}
          </p>
          <p>
            <span className="font-semibold">End date:</span>{" "}
            {project.end_date || "Not set"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Phase:</span>{" "}
            {project.phase}
          </p>
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {project.created_at}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Description</h2>
        <p className="text-gray-800">{project.short_description}</p>
      </div>
    </div>
  );
}

export default ProjectDetails;
