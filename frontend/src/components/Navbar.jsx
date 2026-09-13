import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        JobPortal
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>

        {!user && (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}

        {user && user.role === 'jobseeker' && (
          <Link to="/dashboard" className="btn btn-outline">
            Dashboard
          </Link>
        )}

        {user && user.role === 'recruiter' && (
          <>
            <Link to="/recruiter/post-job" className="btn btn-outline">
              Post Job
            </Link>
            <Link to="/recruiter" className="btn btn-outline">
              Dashboard
            </Link>
          </>
        )}

        {user && (
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
