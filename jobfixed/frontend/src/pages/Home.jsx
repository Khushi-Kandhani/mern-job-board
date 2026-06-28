import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../utils/api';

const JOB_TYPES = ['', 'full-time', 'part-time', 'remote', 'contract', 'internship'];

const TYPE_COLORS = {
  'full-time':  'bg-green-500/10 text-green-400',
  'part-time':  'bg-yellow-500/10 text-yellow-400',
  'remote':     'bg-blue-500/10 text-blue-400',
  'contract':   'bg-purple-500/10 text-purple-400',
  'internship': 'bg-orange-500/10 text-orange-400',
};

function timeAgo(date) {
  const days = Math.floor((Date.now() - new Date(date)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = useCallback(async (params) => {
    setLoading(true);
    try {
      const { data } = await getJobs(params);
      setJobs(data.jobs || data);
      setTotalPages(data.pages || 1);
      setTotal(data.total || (data.jobs || data).length);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs({ search, type, location, page, limit: 9 });
  }, [type, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs({ search, type, location, page: 1, limit: 9 });
  };

  const handleClear = () => {
    setSearch(''); setType(''); setLocation(''); setPage(1);
    fetchJobs({ page: 1, limit: 9 });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-10 shadow-2xl text-center mb-8">
        <h1 className="text-4xl font-bold text-white">
          Find Your <span className="text-blue-400">Dream Job</span>
        </h1>
        <p className="mt-3 text-slate-400 text-lg">
          Browse quality roles from companies that value modern talent.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="card mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input md:w-44"
          />
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="input md:w-44"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t || 'All Types'}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary whitespace-nowrap">
            Search
          </button>
          {(search || type || location) && (
            <button type="button" onClick={handleClear} className="btn-outline whitespace-nowrap">
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4">
        {loading ? 'Loading...' : `${total} job${total !== 1 ? 's' : ''} found`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse h-40 bg-slate-800" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No jobs found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Link key={job._id} to={`/jobs/${job._id}`}>
              <div className="card h-full flex flex-col justify-between cursor-pointer group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-base leading-tight">
                      {job.title}
                    </h3>
                    <span className={`badge shrink-0 ${TYPE_COLORS[job.type] || 'bg-slate-700 text-slate-300'}`}>
                      {job.type}
                    </span>
                  </div>
                  <p className="text-blue-400 font-medium text-sm">{job.company}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary || 'Not disclosed'}</span>
                    <span>👥 {job.applications?.length || 0} applicants</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-3 line-clamp-2">{job.description}</p>
                </div>
                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-800">
                  {timeAgo(job.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn-outline disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="btn-outline disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
