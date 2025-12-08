// -------------------------------------------------------------
// Public landing page that lists all projects and provides
// search functionality by title and/or start date.
//
// Features:
//  - Fetch all projects on initial load
//  - Allow users to filter by title and start date
//  - Link to individual project details
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search form state
  const [titleFilter, setTitleFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");

  // -----------------------------------------------------------
  // Helper: fetch projects from backend
  //
  // If filters are provided, call `/projects/search/query`
  // otherwise call `/projects` to load all projects.
  // -----------------------------------------------------------
  async function fetchProjects(params = {}) {
    try {
      setLoading(true);

      let response;

      if (params.title || params.startDate) {
        const query = new URLSearchParams();
        if (params.title) query.set("title", params.title);
        if (params.startDate) query.set("startDate", params.startDate);

        response = await api.get(`/projects/search/query?${query.toString()}`);
      } else {
        response = await api.get("/projects");
      }

      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  // Load all projects on initial render
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle search form submission
  function handleSearch(e) {
    e.preventDefault();
    fetchProjects({
      title: titleFilter.trim(),
      startDate: startDateFilter || undefined,
    });
  }

  // Clear filters and reload all projects
  function handleClear() {
    setTitleFilter("");
    setStartDateFilter("");
    fetchProjects();
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>

      {/* Search / filter form */}
      <form
        onSubmit={handleSearch}
        className="mb-4 bg-white border rounded-lg shadow-sm p-4 grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-3 items-end"
      >
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            placeholder="Search by title..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Start date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 border rounded py-2 text-sm hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Results list */}
      {loading ? (
        <div>Loading projects...</div>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              to={`/project/${project.pid}`}
              key={project.pid}
              className="border rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition block"
            >
              <h2 className="font-semibold text-lg mb-1">
                {project.title}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                Start date: {project.start_date}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                {project.short_description}
              </p>
              <p className="text-xs text-gray-400">
                Phase: {project.phase} · Owner: {project.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
