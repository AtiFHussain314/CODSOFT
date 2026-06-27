import { ArrowLeft, Banknote, Briefcase, Building2, Clock3, LockKeyhole, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import ApplicationForm from "../components/ApplicationForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fallbackJobs } from "../data/fallbackJobs.js";
import { formatSalary, timeAgo } from "../utils/format.js";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/jobs/${id}`)
      .then(({ job: fetchedJob }) => {
        setJob(fetchedJob);
        setError("");
      })
      .catch(() => {
        const sample = fallbackJobs.find((item) => item._id === id);
        setJob(sample || null);
        setError(sample ? "This is a demo listing until the API is available." : "Job not found.");
      });
  }, [id]);

  if (!job && !error) {
    return <div className="container page-pad">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="container page-pad">
        <div className="empty-state">
          <h1>Job not found</h1>
          <Link className="button" to="/jobs">
            Browse jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-pad">
      <div className="container detail-layout">
        <section className="detail-main">
          <Link className="text-link back-link" to="/jobs">
            <ArrowLeft size={17} />
            Back to jobs
          </Link>
          {error && <div className="notice subtle">{error}</div>}
          <div className="job-detail-header">
            <p className="eyebrow">{job.company}</p>
            <h1>{job.title}</h1>
            <div className="meta-grid">
              <span>
                <MapPin size={17} />
                {job.location}
              </span>
              <span>
                <Briefcase size={17} />
                {job.type}
              </span>
              <span>
                <Banknote size={17} />
                {formatSalary(job)}
              </span>
              <span>
                <Clock3 size={17} />
                {timeAgo(job.createdAt)}
              </span>
            </div>
          </div>

          <section className="content-section">
            <h2>About the role</h2>
            <p>{job.description}</p>
          </section>

          <section className="content-section">
            <h2>Requirements</h2>
            <ul className="check-list">
              {(job.requirements || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="content-section">
            <h2>Benefits</h2>
            <ul className="check-list">
              {(job.benefits || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </section>

        <aside className="detail-sidebar">
          <div className="panel">
            <Building2 size={26} />
            <h2>{job.company}</h2>
            <p>Applications are sent securely to the employer dashboard with email notifications for updates.</p>
            <div className="tag-row">
              {(job.tags || []).map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {user?.role === "candidate" && !String(job._id).startsWith("sample-") && <ApplicationForm job={job} />}

          {user?.role === "candidate" && String(job._id).startsWith("sample-") && (
            <div className="panel">
              <LockKeyhole size={24} />
              <h2>Connect the API to apply</h2>
              <p>Start the backend and seed MongoDB to submit real applications with resume uploads.</p>
            </div>
          )}

          {!user && (
            <div className="panel action-panel">
              <LockKeyhole size={24} />
              <h2>Sign in to apply</h2>
              <p>Candidates can submit a cover letter and resume after logging in.</p>
              <Link className="button" to="/login">
                Login
              </Link>
              <Link className="ghost-button full" to="/register">
                Create account
              </Link>
            </div>
          )}

          {user?.role === "employer" && (
            <div className="panel">
              <h2>Employer view</h2>
              <p>Use your dashboard to post roles, manage company details, and review applications.</p>
              <Link className="button" to="/employer">
                Employer dashboard
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

