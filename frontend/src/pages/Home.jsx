import { useEffect, useState } from "react";
import api from "../api/axios";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
      {projects.length === 0 && <p>No projects found.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.pid}
            className="border rounded-lg bg-white p-4 shadow-sm"
          >
            <h2 className="font-semibold text-lg mb-1">{project.title}</h2>
            <p className="text-sm text-gray-500 mb-1">
              Start date: {project.start_date}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              {project.short_description}
            </p>
            <p className="text-xs text-gray-400">
              Phase: {project.phase} · Owner: {project.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
