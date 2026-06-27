import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import JobCard from "../components/JobCard.jsx";
import SearchPanel from "../components/SearchPanel.jsx";
import { fallbackJobs } from "../data/fallbackJobs.js";

const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const selectedType = searchParams.get("type") || "All";
  const q = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    if (params.get("type") === "All") params.delete("type");

    apiFetch(`/jobs?${params.toString()}`)
      .then(({ jobs: fetchedJobs }) => {
        setJobs(fetchedJobs);
        setError("");
      })
      .catch(() => {
        const filtered = fallbackJobs.filter((job) => {
          const term = q.toLowerCase();
          const place = location.toLowerCase();
          const matchesTerm =
            !term ||
            [job.title, job.company, job.description, ...(job.tags || [])].join(" ").toLowerCase().includes(term);
          const matchesLocation = !place || job.location.toLowerCase().includes(place);
          const matchesType = selectedType === "All" || job.type === selectedType;
          return matchesTerm && matchesLocation && matchesType;
        });
        setJobs(filtered);
        setError("Showing demo listings until the API is available.");
      })
      .finally(() => setLoading(false));
  }, [searchParams, q, location, selectedType]);

  const resultLabel = useMemo(() => {
    if (loading) return "Searching roles...";
    return `${jobs.length} ${jobs.length === 1 ? "role" : "roles"} found`;
  }, [jobs.length, loading]);

  const setType = (type) => {
    const params = new URLSearchParams(searchParams);
    if (type === "All") params.delete("type");
    else params.set("type", type);
    setSearchParams(params);
  };

  return (
    <div className="page-pad">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Job listings</p>
          <h1>Search open roles</h1>
        </div>

        <SearchPanel initialQuery={q} initialLocation={location} compact />

        <div className="listing-toolbar">
          <div>
            <SlidersHorizontal size={19} />
            <strong>{resultLabel}</strong>
          </div>
          <div className="segmented">
            {jobTypes.map((type) => (
              <button
                type="button"
                key={type}
                className={selectedType === type ? "active" : ""}
                onClick={() => setType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="notice subtle">{error}</div>}

        <div className="job-list">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          {!loading && jobs.length === 0 && (
            <div className="empty-state">
              <h2>No matching jobs yet</h2>
              <p>Try a broader keyword, remove the location, or check back after employers add more openings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

