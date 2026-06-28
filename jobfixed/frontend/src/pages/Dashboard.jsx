import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyJobs, deleteJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');
    if (user.role !== 'employer') { setLoading(false); return; }
    getMyJobs()
      .then(({ data }) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Error loading jobs'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success('Job deleted');
    } catch {
      toast.error('Error deleting job');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-blue-400">{user?.name}</span> ·{' '}
              <span className="capitalize">{user?.role}</span>
            </p>
          </div>
          {user?.role === 'employer' && (
            <Link to="/post-job" className="btn-primary">
              + Post a Job
            </Link>
          )}
        </div>

        {user?.role === 'employer' && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="dashboard-stat">
              <p className="text-2xl font-bold text-white">{jobs.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Jobs Posted</p>
            </div>
            <div className="dashboard-stat">
              <p className="text-2xl font-bold text-white">
                {jobs.reduce((sum, j) => sum + (j.applications?.length || 0), 0)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Total Applicants</p>
            </div>
          </div>
        )}
      </div>

      {/* Employer: Posted Jobs */}
      {user?.role === 'employer' ? (
        <>
          <h2 className="font-semibold text-slate-300 mb-3">
            Your Posted Jobs ({jobs.length})
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card animate-pulse h-16 bg-slate-800" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-4xl mb-3">📋</p>
              <p>No jobs posted yet.</p>
              <Link to="/post-job" className="btn-primary inline-block mt-4">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="card flex items-center justify-between dashboard-list-item"
                >
                  <div>
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {job.company} · {job.location} ·{' '}
                      <span className="text-blue-400">{job.applications?.length || 0} applicants</span>
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link to={`/jobs/${job._id}/applicants`} className="btn-outline text-xs">
                      Applicants
                    </Link>
                    <Link to={`/edit-job/${job._id}`} className="btn-outline text-xs">
                      Edit
                    </Link>
                    <Link to={`/jobs/${job._id}`} className="btn-outline text-xs">
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Candidate view */
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>Browse jobs and apply to track your applications.</p>
          <Link to="/" className="btn-primary inline-block mt-4">
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
