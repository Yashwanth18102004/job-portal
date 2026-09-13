import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data.job));
  }, [id]);

  const handleApply = async () => {
    setMessage('');
    try {
      await api.post(`/applications/${id}`, {});
      setApplied(true);
      setMessage('Application submitted successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (!job) return <p className="page-loading">Loading job details...</p>;

  return (
    <div className="job-details">
      <div className="job-details-header">
        <div>
          <h1>{job.title}</h1>
          <p className="company">
            {job.company} &middot; {job.location}
          </p>
        </div>
        <div className="salary-box">
          ₹{job.salaryMin} - ₹{job.salaryMax} LPA
        </div>
      </div>

      <div className="job-meta-row">
        <span className="badge">{job.type}</span>
        <span className="badge">{job.experience}</span>
      </div>

      <section>
        <h3>Job Description</h3>
        <p>{job.description}</p>
      </section>

      {job.responsibilities?.length > 0 && (
        <section>
          <h3>Responsibilities</h3>
          <ul>
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {job.skills?.length > 0 && (
        <section>
          <h3>Required Skills</h3>
          <div className="skills-chip-list">
            {job.skills.map((s, i) => (
              <span key={i} className="chip">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {job.qualifications?.length > 0 && (
        <section>
          <h3>Qualifications</h3>
          <ul>
            {job.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {message && <p className="form-message">{message}</p>}

      {user && user.role === 'jobseeker' && !applied && (
        <button className="btn btn-primary" onClick={handleApply}>
          Apply Now
        </button>
      )}
      {(!user || user.role !== 'jobseeker') && (
        <p className="hint">Log in as a job seeker to apply for this role.</p>
      )}
    </div>
  );
}
