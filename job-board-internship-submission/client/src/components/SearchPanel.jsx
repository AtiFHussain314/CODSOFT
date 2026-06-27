import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPanel({ initialQuery = "", initialLocation = "", compact = false }) {
  const [q, setQ] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form className={`search-panel ${compact ? "compact" : ""}`} onSubmit={submit}>
      <label>
        <span>Role, skill, or company</span>
        <div className="input-with-icon">
          <Search size={18} />
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="React, designer, analyst" />
        </div>
      </label>
      <label>
        <span>Location</span>
        <div className="input-with-icon">
          <MapPin size={18} />
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Remote, Austin, Chicago" />
        </div>
      </label>
      <button className="button" type="submit">
        Search jobs
      </button>
    </form>
  );
}

