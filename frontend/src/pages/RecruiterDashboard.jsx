import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/jobs/recruiter/mine'), api.get('/applications/recruiter/all')])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data.jobs);
        setApplications(appsRes.data.applications);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;
    await api.delete(`/jobs/${jobId}`);
    loadData();
  };

  const handleStatusChange = async (appId, status) => {
    await api.put(`/applications/${appId}/status`, { status });
    loadData();
  };

  const totalApplications = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const hired = applications.filter((a) => a.status === 'Hired').length;

  if (loading) return <p className="page-loading">Loading dashboard...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Recruiter Dashboard</h1>
        <Link to="/recruiter/post-job" className="btn btn-primary">
          + Post New Job
        </Link>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{jobs.length}</span>
          <span>Total Jobs</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalApplications}</span>
          <span>Applications</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{shortlisted}</span>
          <span>Shortlisted</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{hired}</span>
          <span>Hired</span>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>My Posted Jobs</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={4}>You haven't posted any jobs yet.</td>
              </tr>
            )}
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.status}</td>
                <td>
                  <button className="btn btn-outline small" onClick={() => handleDelete(job._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="dashboard-section">
        <h2>Manage Applications</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td colSpan={4}>No applications received yet.</td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.applicant?.name}</td>
                <td>{app.job?.title}</td>
                <td>
                  <span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span>
                </td>
                <td>
                  <select value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}>
                    <option>Applied</option>
                    <option>Shortlisted</option>
                    <option>Rejected</option>
                    <option>Hired</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
