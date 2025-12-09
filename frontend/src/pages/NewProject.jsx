// -------------------------------------------------------------
// Protected page to create a new project.
// Minimal validation:
//  - Title required
//  - Start date required
//  - Short description required
// Shows simple error / success messages.
// -------------------------------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Alert from "../components/Alert";

function NewProject() {
  const [title, setTitle]                 = useState("");
  const [startDate, setStartDate]         = useState("");
  const [endDate, setEndDate]             = useState("");
  const [shortDescription, setShortDesc]  = useState("");
  const [phase, setPhase]                 = useState("design");

  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving]           = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});
    setSaving(true);

    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError("Please fix the highlighted fields.");
      setSaving(false);
      return;
    }

    try {
      const res = await api.post("/projects", {
        title: title.trim(),
        start_date: startDate,
        end_date: endDate || null,
        short_description: shortDescription.trim(),
        phase,
      });

      if (!res.data.success) {
        setError(res.data.message || "Failed to create project.");
      } else {
        setSuccess("Project created successfully. Redirecting...");
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("An error occurred while creating the project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">New Project</h1>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <form
        onSubmit={handleSubmit}
        className="card-padded space-y-4"
      >
        <div>
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {fieldErrors.title && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Start date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {fieldErrors.startDate && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.startDate}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">End date (optional)</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Short description</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDesc(e.target.value)}
          />
          {fieldErrors.shortDescription && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.shortDescription}
            </p>
          )}
        </div>

        <div>
          <label className="form-label">Phase</label>
          <select
            className="form-select"
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
          className="btn-primary w-full disabled:opacity-60"
        >
          {saving ? "Saving..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default NewProject;
