import { BriefcaseBusiness, Building2, CheckCircle2, ClipboardList, PlusCircle, Trash2, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch, getAssetUrl } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatSalary } from "../utils/format.js";

const emptyJob = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  salaryMin: "",
  salaryMax: "",
  description: "",
  requirements: "",
  benefits: "",
  tags: "",
  featured: false
};

export default function EmployerDashboard() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobForm, setJobForm] = useState(() => ({ ...emptyJob, company: user?.company?.name || "" }));
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    location: user?.location || "",
    company: {
      name: user?.company?.name || "",
      website: user?.company?.website || "",
      size: user?.company?.size || "",
      description: user?.company?.description || ""
    }
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(
    () => [
      { label: "Open jobs", value: jobs.filter((job) => job.status === "open").length, icon: BriefcaseBusiness },
      { label: "Applications", value: applications.length, icon: UsersRound },
      { label: "Featured roles", value: jobs.filter((job) => job.featured).length, icon: CheckCircle2 }
    ],
    [jobs, applications]
  );

  const loadDashboard = async () => {
    try {
      const [jobData, applicationData] = await Promise.all([
        apiFetch("/jobs/mine"),
        apiFetch("/applications/received")
      ]);
      setJobs(jobData.jobs);
      setApplications(applicationData.applications);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateJobField = (event) => {
    const { name, value, type, checked } = event.target;
    setJobForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("company.")) {
      const key = name.replace("company.", "");
      setProfileForm((current) => ({ ...current, company: { ...current.company, [key]: value } }));
      return;
    }

    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const createJob = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      const payload = {
        ...jobForm,
        salaryMin: jobForm.salaryMin ? Number(jobForm.salaryMin) : undefined,
        salaryMax: jobForm.salaryMax ? Number(jobForm.salaryMax) : undefined
      };
      const { job } = await apiFetch("/jobs", { method: "POST", body: payload });
      setJobs((current) => [job, ...current]);
      setJobForm({ ...emptyJob, company: profileForm.company.name || user?.company?.name || "" });
      setNotice("Job posted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteJob = async (jobId) => {
    setNotice("");
    setError("");

    try {
      await apiFetch(`/jobs/${jobId}`, { method: "DELETE" });
      setJobs((current) => current.filter((job) => job._id !== jobId));
      setNotice("Job removed.");
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const { application } = await apiFetch(`/applications/${applicationId}/status`, {
        method: "PATCH",
        body: { status }
      });
      setApplications((current) =>
        current.map((item) => (item._id === application._id ? { ...item, status: application.status } : item))
      );
      setNotice("Candidate notified about the status update.");
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      await updateUser(profileForm);
      setNotice("Company profile updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-page page-pad">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Employer dashboard</p>
            <h1>{profileForm.company.name || user.name}</h1>
          </div>
          <div className="dashboard-tabs">
            <button className={activeTab === "jobs" ? "active" : ""} type="button" onClick={() => setActiveTab("jobs")}>
              <BriefcaseBusiness size={17} />
              Jobs
            </button>
            <button
              className={activeTab === "applicants" ? "active" : ""}
              type="button"
              onClick={() => setActiveTab("applicants")}
            >
              <ClipboardList size={17} />
              Applicants
            </button>
            <button
              className={activeTab === "profile" ? "active" : ""}
              type="button"
              onClick={() => setActiveTab("profile")}
            >
              <Building2 size={17} />
              Profile
            </button>
          </div>
        </div>

        <div className="stat-grid">
          {stats.map(({ label, value, icon: Icon }) => (
            <div className="stat-card" key={label}>
              <Icon size={22} />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {notice && <div className="notice success">{notice}</div>}
        {error && <div className="notice error">{error}</div>}

        {activeTab === "jobs" && (
          <div className="dashboard-grid">
            <form className="panel" onSubmit={createJob}>
              <div className="section-heading">
                <p className="eyebrow">Post opening</p>
                <h2>Create a job</h2>
              </div>
              <div className="form-grid two">
                <label>
                  Job title
                  <input name="title" value={jobForm.title} onChange={updateJobField} required />
                </label>
                <label>
                  Company
                  <input name="company" value={jobForm.company} onChange={updateJobField} required />
                </label>
                <label>
                  Location
                  <input name="location" value={jobForm.location} onChange={updateJobField} required />
                </label>
                <label>
                  Type
                  <select name="type" value={jobForm.type} onChange={updateJobField}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Remote</option>
                  </select>
                </label>
                <label>
                  Minimum salary
                  <input name="salaryMin" type="number" min="0" value={jobForm.salaryMin} onChange={updateJobField} />
                </label>
                <label>
                  Maximum salary
                  <input name="salaryMax" type="number" min="0" value={jobForm.salaryMax} onChange={updateJobField} />
                </label>
              </div>
              <label>
                Description
                <textarea name="description" rows="5" value={jobForm.description} onChange={updateJobField} required />
              </label>
              <label>
                Requirements
                <textarea
                  name="requirements"
                  rows="3"
                  value={jobForm.requirements}
                  onChange={updateJobField}
                  placeholder="React, accessibility, mentoring"
                />
              </label>
              <label>
                Benefits
                <input name="benefits" value={jobForm.benefits} onChange={updateJobField} placeholder="Health, equity, remote" />
              </label>
              <label>
                Tags
                <input name="tags" value={jobForm.tags} onChange={updateJobField} placeholder="Node.js, MongoDB, API" />
              </label>
              <label className="checkbox-row">
                <input name="featured" type="checkbox" checked={jobForm.featured} onChange={updateJobField} />
                Feature this job
              </label>
              <button className="button" type="submit">
                <PlusCircle size={18} />
                Post job
              </button>
            </form>

            <section className="stack">
              {jobs.map((job) => (
                <article className="job-card compact-card" key={job._id}>
                  <div className="job-card-top">
                    <div>
                      <p className="eyebrow">{job.company}</p>
                      <h3>{job.title}</h3>
                    </div>
                    <span className="pill">{job.status}</span>
                  </div>
                  <div className="meta-grid">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                    <span>{formatSalary(job)}</span>
                  </div>
                  <button className="ghost-button danger" type="button" onClick={() => deleteJob(job._id)}>
                    <Trash2 size={17} />
                    Delete
                  </button>
                </article>
              ))}
              {jobs.length === 0 && (
                <div className="empty-state">
                  <h2>No jobs posted yet</h2>
                  <p>Create the first opening and it will appear in search immediately.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "applicants" && (
          <section className="stack">
            {applications.map((application) => (
              <article className="application-row" key={application._id}>
                <div>
                  <p className="eyebrow">{application.job?.title}</p>
                  <h3>{application.name}</h3>
                  <p>{application.coverLetter}</p>
                  <div className="tag-row">
                    <span className="tag">{application.email}</span>
                    {application.phone && <span className="tag">{application.phone}</span>}
                    <a className="tag" href={getAssetUrl(application.resumeUrl)} target="_blank" rel="noreferrer">
                      Resume
                    </a>
                  </div>
                </div>
                <label className="status-select">
                  Status
                  <select value={application.status} onChange={(event) => updateStatus(application._id, event.target.value)}>
                    <option value="submitted">Submitted</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </label>
              </article>
            ))}
            {applications.length === 0 && (
              <div className="empty-state">
                <h2>No applications yet</h2>
                <p>Applications will appear here with resumes and status controls.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "profile" && (
          <form className="panel profile-panel" onSubmit={saveProfile}>
            <div className="section-heading">
              <p className="eyebrow">Account management</p>
              <h2>Company profile</h2>
            </div>
            <div className="form-grid two">
              <label>
                Contact name
                <input name="name" value={profileForm.name} onChange={updateProfileField} />
              </label>
              <label>
                Company name
                <input name="company.name" value={profileForm.company.name} onChange={updateProfileField} />
              </label>
              <label>
                Website
                <input name="company.website" value={profileForm.company.website} onChange={updateProfileField} />
              </label>
              <label>
                Company size
                <input name="company.size" value={profileForm.company.size} onChange={updateProfileField} />
              </label>
              <label>
                Location
                <input name="location" value={profileForm.location} onChange={updateProfileField} />
              </label>
            </div>
            <label>
              Company description
              <textarea
                name="company.description"
                rows="5"
                value={profileForm.company.description}
                onChange={updateProfileField}
              />
            </label>
            <button className="button" type="submit">
              Save profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

