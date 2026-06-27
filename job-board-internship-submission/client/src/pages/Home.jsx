import { ArrowRight, Building2, FileCheck2, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import JobCard from "../components/JobCard.jsx";
import SearchPanel from "../components/SearchPanel.jsx";
import { fallbackJobs } from "../data/fallbackJobs.js";

export default function Home() {
  const [jobs, setJobs] = useState(fallbackJobs.filter((job) => job.featured));
  const [apiOffline, setApiOffline] = useState(false);

  useEffect(() => {
    apiFetch("/jobs?featured=true")
      .then(({ jobs: featuredJobs }) => {
        setJobs(featuredJobs.length ? featuredJobs : fallbackJobs.filter((job) => job.featured));
        setApiOffline(false);
      })
      .catch(() => {
        setApiOffline(true);
        setJobs(fallbackJobs.filter((job) => job.featured));
      });
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Welcome to TalentBridge</p>
            <h1>Find the next role, or the next person, with less friction.</h1>
            <p>
              A full-stack job board for employers to publish openings and candidates to search, apply,
              and track opportunities from one secure workspace.
            </p>
            <SearchPanel />
            {apiOffline && (
              <div className="notice subtle">
                Demo listings are showing until the API and MongoDB are running.
              </div>
            )}
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="visual-row active">
              <div>
                <strong>Frontend Engineer</strong>
                <small>Remote - 42 applicants</small>
              </div>
              <span>Open</span>
            </div>
            <div className="visual-row">
              <div>
                <strong>Backend API Developer</strong>
                <small>Austin - 18 applicants</small>
              </div>
              <span>Reviewing</span>
            </div>
            <div className="visual-metrics">
              <div>
                <strong>128</strong>
                <small>Applications</small>
              </div>
              <div>
                <strong>24</strong>
                <small>Interviews</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container">
          <div className="section-heading split">
            <div>
              <p className="eyebrow">Featured roles</p>
              <h2>Openings worth a closer look</h2>
            </div>
            <Link className="text-link" to="/jobs">
              View all jobs
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="container trust-strip">
        <div>
          <ShieldCheck size={24} />
          Secure login
        </div>
        <div>
          <Building2 size={24} />
          Employer dashboards
        </div>
        <div>
          <FileCheck2 size={24} />
          Resume applications
        </div>
        <div>
          <UsersRound size={24} />
          Candidate tracking
        </div>
      </section>
    </>
  );
}

