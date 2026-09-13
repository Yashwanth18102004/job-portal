import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full Time',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    responsibilities: '',
    skills: '',
    qualifications: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        qualifications: form.qualifications.split('\n').map((s) => s.trim()).filter(Boolean),
      };
      await api.post('/jobs', payload);
      navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form wide" onSubmit={handleSubmit}>
        <h2>Post a New Job</h2>
        {error && <p className="form-error">{error}</p>}

        <label>Job Title</label>
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <label>Company</label>
        <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />

        <label>Location</label>
        <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

        <label>Job Type</label>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>

        <label>Experience (e.g. 2-4 Yrs)</label>
        <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />

        <div className="two-col">
          <div>
            <label>Min Salary (LPA)</label>
            <input
              type="number"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
            />
          </div>
          <div>
            <label>Max Salary (LPA)</label>
            <input
              type="number"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
            />
          </div>
        </div>

        <label>Description</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label>Responsibilities (one per line)</label>
        <textarea
          rows={3}
          value={form.responsibilities}
          onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
        />

        <label>Required Skills (comma separated)</label>
        <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />

        <label>Qualifications (one per line)</label>
        <textarea
          rows={3}
          value={form.qualifications}
          onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
        />

        <button type="submit" className="btn btn-primary full-width">
          Post Job
        </button>
      </form>
    </div>
  );
}
