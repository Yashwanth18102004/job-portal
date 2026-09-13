import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
    company: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { confirmPassword, ...payload } = form;
      const user = await register(payload);
      navigate(user.role === 'recruiter' ? '/recruiter' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        {error && <p className="form-error">{error}</p>}

        <label>Full Name *</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label>Email Address *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Phone Number</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <label>Password *</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>Confirm Password *</label>
        <input
          type="password"
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <label>User Type *</label>
        <div className="role-toggle">
          <button
            type="button"
            className={form.role === 'jobseeker' ? 'role-btn active' : 'role-btn'}
            onClick={() => setForm({ ...form, role: 'jobseeker' })}
          >
            Job Seeker
          </button>
          <button
            type="button"
            className={form.role === 'recruiter' ? 'role-btn active' : 'role-btn'}
            onClick={() => setForm({ ...form, role: 'recruiter' })}
          >
            Recruiter
          </button>
        </div>

        {form.role === 'recruiter' && (
          <>
            <label>Company</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </>
        )}

        <button type="submit" className="btn btn-primary full-width">
          Register
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
