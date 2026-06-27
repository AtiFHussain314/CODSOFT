import { Briefcase, FileText, Send, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CandidateDashboard() {
  const { user, updateUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    location: user?.location || "",
    skills: (user?.skills || []).join(", "),
    resumeUrl: user?.resumeUrl || ""
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(
    () => [
      { label: "Applications", value: applications.length, icon: Send },
      {
        label: "In review",
        value: applications.filter((item) => ["reviewing", "shortlisted"].includes(item.status)).length,
        icon: Briefcase
      },
      { label: "Profile skills", value: user?.skills?.length || 0, icon: FileText }
    ],
    [applications, user]
  );

  useEffect(() => {
    apiFetch("/applications/mine")
      .then(({ applications: items }) => {
        setApplications(items);
        setError("");
      })
      .catch((err) => setError(err.message));
  }, []);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      await updateUser(profileForm);
      setNotice("Profile updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-page page-pad">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Candidate dashboard</p>
            <h1>{user.name}</h1>
          </div>
          <Link className="button" to="/jobs">
            <Briefcase size={18} />
            Search jobs
          </Link>
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

        <div className="dashboard-grid">
          <form className="panel profile-panel" onSubmit={saveProfile}>
            <div className="section-heading">
              <p className="eyebrow">Profile management</p>
              <h2>Your candidate profile</h2>
            </div>
            <label>
              Full name
              <input name="name" value={profileForm.name} onChange={updateProfileField} />
            </label>
            <label>
              Headline
              <input
                name="headline"
                value={profileForm.headline}
                onChange={updateProfileField}
                placeholder="Full-stack developer, product designer, analyst"
              />
            </label>
            <label>
              Location
              <input name="location" value={profileForm.location} onChange={updateProfileField} />
            </label>
            <label>
              Skills
              <input name="skills" value={profileForm.skills} onChange={updateProfileField} />
            </label>
            <label>
              Resume URL
              <input name="resumeUrl" value={profileForm.resumeUrl} onChange={updateProfileField} />
            </label>
            <button className="button" type="submit">
              <UserRound size={18} />
              Save profile
            </button>
          </form>

          <section className="stack">
            {applications.map((application) => (
              <article className="application-row" key={application._id}>
                <div>
                  <p className="eyebrow">{application.job?.company}</p>
                  <h3>{application.job?.title}</h3>
                  <p>{application.job?.location} - {application.job?.type}</p>
                </div>
                <span className={`pill status-${application.status}`}>{application.status}</span>
              </article>
            ))}
            {applications.length === 0 && (
              <div className="empty-state">
                <h2>No applications yet</h2>
                <p>Search jobs and submit your resume to start tracking applications here.</p>
                <Link className="button" to="/jobs">
                  Browse jobs
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

