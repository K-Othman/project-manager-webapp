// -------------------------------------------------------------
// Protected page used to create a new project for the
// authenticated user.
//
// Features:
//  - Validates input on client side (min lengths, required fields)
//  - Calls POST /api/projects
//  - Redirects to dashboard on success
// -------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function NewProject() {
  const [title, setTitle]                 = useState("");
  const [startDate, setStartDate]         = useState("");
  const [endDate, setEndDate]             = useState("");
  const [shortDescription, setShortDesc]  = useState("");
  const [phase, setPhase]                 = useState("design");
  const [error, setError]                 = useState("");
  const [saving, setSaving]               = useState(false);

  const navigate = useNavigate();

  // -----------------------------------------------------------
  // Submit handler for creating a new project
  // -----------------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await api.post("/projects", {
        title,
        start_date: startDate,
        end_date: endDate || null,
        short_description: shortDescription,
        phase,
      });

      if (!res.data.success) {
        setError(res.data.message || "Failed to create project.");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("An error occurred while creating the project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Project</h1>

      {/* Error message */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {/* Project creation form */}
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
          className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default NewProject;
