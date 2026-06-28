import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { applyToJob, getJob, deleteJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = {
  'full-time':  'bg-green-500/10 text-green-400',
  'part-time':  'bg-yellow-500/10 text-yellow-400',
  'remote':     'bg-blue-500/10 text-blue-400',
  'contract':   'bg-purple-500/10 text-purple-400',
  'internship': 'bg-orange-500/10 text-orange-400',
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    getJob(id)
      .then(({ data }) => setJob(data))
      .catch(() => toast.error('Error loading job'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await applyToJob(id);
      toast.success('Applied successfully!');
      setJob((prev) => ({
        ...prev,
        applications: [...(prev.applications || []), { user: user._id }],
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Error deleting job');
    }
  };

  const isOwner = user && job && (
    job.postedBy?._id === user._id ||
    job.postedBy === user._id ||
    job.postedBy?._id?.toString() === user._id?.toString()
  );

  const hasApplied = job?.applications?.some(
    (a) => a.user === user?._id || a.user?._id === user?._id ||
           a.user?.toString() === user?._id?.toString()
  );

  if (loading) return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="card animate-pulse space-y-4">
        <div className="h-8 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800 rounded w-1/2" />
        <div className="h-32 bg-slate-800 rounded" />
      </div>
    </div>
  );

  if (!job) return (
    <div className="text-center py-20 text-slate-400">Job not found.</div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1"
      >
        ← Back to jobs
      </button>

      <div className="card space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{job.title}</h1>
            <p className="mt-1 text-blue-400 font-semibold text-lg">{job.company}</p>
          </div>
          <span className={`badge ${TYPE_COLORS[job.type] || 'bg-slate-700 text-slate-300'}`}>
            {job.type}
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-slate-400 pb-4 border-b border-slate-800">
          <span>📍 {job.location}</span>
          <span>💰 {job.salary || 'Not disclosed'}</span>
          <span>👥 {job.applications?.length || 0} applicants</span>
          <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
          {job.postedBy?.name && <span>👤 {job.postedBy.name}</span>}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Job Description</h2>
          <p className="text-slate-400 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Requirements</h2>
          <p className="text-slate-400 leading-relaxed whitespace-pre-line">{job.requirements}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
          {isOwner ? (
            <>
              <Link to={`/edit-job/${job._id}`} className="btn-primary">Edit Job</Link>
              <Link to={`/jobs/${job._id}/applicants`} className="btn-outline">
                View Applicants ({job.applications?.length || 0})
              </Link>
              <button onClick={handleDelete}
                className="px-4 py-2 rounded-lg border border-red-800 text-red-400 hover:bg-red-900/20 transition-colors font-medium">
                Delete Job
              </button>
            </>
          ) : user ? (
            <button
              onClick={handleApply}
              disabled={hasApplied || applying}
              className={`btn-primary ${hasApplied ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {hasApplied ? '✓ Already Applied' : applying ? 'Applying...' : 'Apply Now'}
            </button>
          ) : (
            <Link to="/login" className="btn-primary">Login to Apply</Link>
          )}
        </div>
      </div>
    </div>
  );
}
