import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard.jsx';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/jobs', { params: { limit: 3, sort: '-createdAt' } })
      .then((res) => setFeatured(res.data.jobs))
      .catch(() => setFeatured([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>Find Your Dream Job</h1>
        <p>Discover thousands of jobs from top companies and build your career.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title, keyword or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search Jobs
          </button>
        </form>
      </section>

      <section className="featured">
        <h2>Featured Jobs</h2>
        <div className="job-grid">
          {featured.length === 0 && <p>No jobs posted yet — check back soon.</p>}
          {featured.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}
