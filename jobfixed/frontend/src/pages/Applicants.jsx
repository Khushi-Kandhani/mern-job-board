import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getJobApplicants, getJob } from '../utils/api';

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getJob(id), getJobApplicants(id)])
      .then(([jobRes, appRes]) => {
        setJob(jobRes.data);
        setApplicants(appRes.data);
      })
      .catch(() => toast.error('Error loading applicants'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button onClick={() => navigate(-1)}
        className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-1">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">
        Applicants
      </h1>
      {job && (
        <p className="text-slate-400 text-sm mb-6">
          {job.title} at {job.company} · {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse h-16 bg-slate-800" />
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">👥</p>
          <p>No applicants yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applicants.map((a, i) => (
            <div key={a._id || i} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  {a.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-white">{a.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-400">{a.email}</p>
                </div>
              </div>
              <a href={`mailto:${a.email}`}
                className="btn-outline text-xs">
                Contact
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
