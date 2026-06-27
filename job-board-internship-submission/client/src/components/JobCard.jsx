import { ArrowRight, Banknote, Briefcase, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatSalary, timeAgo } from "../utils/format.js";

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div>
          <p className="eyebrow">{job.company}</p>
          <h3>{job.title}</h3>
        </div>
        {job.featured && <span className="pill accent">Featured</span>}
      </div>
      <div className="meta-grid">
        <span>
          <MapPin size={16} />
          {job.location}
        </span>
        <span>
          <Briefcase size={16} />
          {job.type}
        </span>
        <span>
          <Banknote size={16} />
          {formatSalary(job)}
        </span>
        <span>
          <Clock3 size={16} />
          {timeAgo(job.createdAt)}
        </span>
      </div>
      <p>{job.description}</p>
      <div className="tag-row">
        {(job.tags || []).slice(0, 4).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <Link className="text-link" to={`/jobs/${job._id}`}>
        View role
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}

