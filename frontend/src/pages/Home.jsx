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
     <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="page-title">All Projects</h1>
        <p className="text-muted">
          Browse all projects or filter by title and start date.
        </p>
      </div>

      {/* Search card */}
      <form
        onSubmit={handleSearch}
        className="card-padded mb-4 grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-3 items-end"
      >
        <div>
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            placeholder="Search by title..."
          />
        </div>

        <div>
          <label className="form-label">Start date</label>
          <input
            type="date"
            className="form-input"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary flex-1"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Projects grid */}
      {loading ? (
        <div className="card-padded">
          <p className="text-muted">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="card-padded">
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              to={`/project/${project.pid}`}
              key={project.pid}
              className="card-padded hover:shadow-md transition block"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <span className="badge-pill">
                  {project.phase}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-1">
                Start date: {project.start_date}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                {project.short_description}
              </p>

              <p className="text-xs text-gray-400">
                Owner: {project.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
