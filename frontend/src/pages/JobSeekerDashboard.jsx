import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobSeekerDashboard() {
  const { user, setUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    skills: (user?.skills || []).join(', '),
    resumeUrl: user?.resumeUrl || '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/applications/mine').then((res) => setApplications(res.data.applications));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = {
        name: profile.name,
        phone: profile.phone,
        resumeUrl: profile.resumeUrl,
        skills: profile.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await api.put('/auth/me', payload);
      setUser(res.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="dashboard">
      <h1>Job Seeker Dashboard</h1>

      <section className="dashboard-section">
        <h2>Profile Overview</h2>
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <label>Name</label>
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />

          <label>Phone</label>
          <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />

          <label>Skills (comma separated)</label>
          <input
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            placeholder="React, Node.js, MongoDB"
          />

          <label>Resume URL</label>
          <input
            value={profile.resumeUrl}
            onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
            placeholder="Link to your uploaded resume"
          />

          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </section>

      <section className="dashboard-section">
        <h2>My Applications</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied On</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td colSpan={4}>No applications yet.</td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.job?.title}</td>
                <td>{app.job?.company}</td>
                <td>
                  <span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span>
                </td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
