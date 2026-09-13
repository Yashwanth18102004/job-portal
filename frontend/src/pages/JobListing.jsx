import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard.jsx';

export default function JobListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    type: '',
    minSalary: '',
    maxSalary: '',
  });

  const fetchJobs = (pageNum = 1) => {
    setLoading(true);
    api
      .get('/jobs', {
        params: { ...filters, page: pageNum, limit: 6 },
      })
      .then((res) => {
        setJobs(res.data.jobs);
        setTotal(res.data.total);
        setPage(res.data.page);
        setPages(res.data.pages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ keyword: filters.keyword, location: filters.location });
    fetchJobs(1);
  };

  const clearFilters = () => {
    const cleared = { keyword: '', location: '', type: '', minSalary: '', maxSalary: '' };
    setFilters(cleared);
    setSearchParams({});
    setTimeout(() => fetchJobs(1), 0);
  };

  return (
    <div className="job-listing">
      <aside className="filters">
        <h3>Filter Jobs</h3>
        <form onSubmit={handleFilterSubmit}>
          <label>Keyword</label>
          <input
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            placeholder="Title, company, skill"
          />

          <label>Location</label>
          <input
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="City"
          />

          <label>Job Type</label>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>

          <label>Min Salary (LPA)</label>
          <input
            type="number"
            value={filters.minSalary}
            onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
          />

          <label>Max Salary (LPA)</label>
          <input
            type="number"
            value={filters.maxSalary}
            onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
          />

          <button type="submit" className="btn btn-primary full-width">
            Apply Filters
          </button>
          <button type="button" className="btn btn-outline full-width" onClick={clearFilters}>
            Clear All
          </button>
        </form>
      </aside>

      <section className="results">
        <h2>{total} Jobs Found</h2>
        {loading && <p>Loading jobs...</p>}
        <div className="job-grid">
          {!loading && jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>

        {pages > 1 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => fetchJobs(page - 1)}>
              Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button disabled={page >= pages} onClick={() => fetchJobs(page + 1)}>
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
