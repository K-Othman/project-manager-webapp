// -------------------------------------------------------------
// Protected page used to edit an existing project.
// - Loads project by ID on mount
// - Submits updates via PUT /api/projects/:id
// - Backend enforces ownership (only owner can update)
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle]                 = useState("");
  const [startDate, setStartDate]         = useState("");
  const [endDate, setEndDate]             = useState("");
  const [shortDescription, setShortDesc]  = useState("");
  const [phase, setPhase]                 = useState("design");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  // -----------------------------------------------------------
  // Load existing project data when the page mounts
  // -----------------------------------------------------------
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await api.get(`/projects/${id}`);

        if (res.data.success) {
          const p = res.data.project;
          setTitle(p.title);
          setStartDate(p.start_date);
          setEndDate(p.end_date || "");
          setShortDesc(p.short_description);
          setPhase(p.phase);
        } else {
          setError(res.data.message || "Failed to load project.");
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Unable to load project.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  // -----------------------------------------------------------
  // Submit handler for updating the project
  // -----------------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await api.put(`/projects/${id}`, {
        title,
        start_date: startDate,
        end_date: endDate || null,
        short_description: shortDescription,
        phase,
      });

      if (!res.data.success) {
        setError(res.data.message || "Failed to update project.");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error updating project:", err);

      // If backend returns 403, user is not authorised
      if (err.response?.status === 403) {
        setError("You are not authorised to edit this project.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while updating the project.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-4">Loading project...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>

      {/* Error message */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg shadow-sm p-4 space-y-4"
      >
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={150}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Start date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">End date (optional)</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Short description</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDesc(e.target.value)}
            required
            minLength={10}
            maxLength={255}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phase</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
          >
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="testing">Testing</option>
            <option value="deployment">Deployment</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white rounded py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Update Project"}
        </button>
      </form>
    </div>
  );
}

export default EditProject;
