import { Send, UploadCloud } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ApplicationForm({ job }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    coverLetter: ""
  });
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = new FormData();
      payload.append("jobId", job._id);
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append("resume", resume);

      await apiFetch("/applications", { method: "POST", body: payload });
      setStatus({ type: "success", message: "Application submitted. A confirmation email has been queued." });
      setForm((current) => ({ ...current, phone: "", coverLetter: "" }));
      setResume(null);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel application-form" onSubmit={submit}>
      <div className="section-heading">
        <p className="eyebrow">Apply now</p>
        <h2>Submit your application</h2>
      </div>
      <div className="form-grid two">
        <label>
          Full name
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
      </div>
      <label>
        Phone
        <input name="phone" value={form.phone} onChange={update} placeholder="+1 555 0100" />
      </label>
      <label>
        Cover letter
        <textarea
          name="coverLetter"
          value={form.coverLetter}
          onChange={update}
          required
          rows="6"
          placeholder="Tell the employer why this role fits your work and goals."
        />
      </label>
      <label className="file-input">
        <UploadCloud size={22} />
        <span>{resume ? resume.name : "Upload resume as PDF, DOC, or DOCX"}</span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          required
          onChange={(event) => setResume(event.target.files?.[0] || null)}
        />
      </label>
      {status.message && <div className={`notice ${status.type}`}>{status.message}</div>}
      <button className="button" type="submit" disabled={submitting}>
        <Send size={18} />
        {submitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}

