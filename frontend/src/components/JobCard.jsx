import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className="badge">{job.type}</span>
      </div>
      <p className="company">
        {job.company} &middot; {job.location}
      </p>
      <p className="meta">
        {job.experience} &middot; ₹{job.salaryMin} - ₹{job.salaryMax} LPA
      </p>
      <p className="skills">{(job.skills || []).slice(0, 5).join(', ')}</p>
      <Link to={`/jobs/${job._id}`} className="btn btn-primary">
        View Details
      </Link>
    </div>
  );
}
