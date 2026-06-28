import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getJob, updateJob } from '../utils/api';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'full-time',
    salary: '', description: '', requirements: '',
  });

  useEffect(() => {
    getJob(id)
      .then(({ data }) => setForm({
        title: data.title || '',
        company: data.company || '',
        location: data.location || '',
        type: data.type || 'full-time',
        salary: data.salary || '',
        description: data.description || '',
        requirements: data.requirements || '',
      }))
      .catch(() => toast.error('Error loading job'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateJob(id, form);
      toast.success('Job updated!');
      navigate(`/jobs/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating job');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="card animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-800 rounded" />)}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Job</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company *</label>
              <input name="company" value={form.company} onChange={handleChange} className="input" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Location *</label>
              <input name="location" value={form.location} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Job Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="input">
                {['full-time', 'part-time', 'remote', 'contract', 'internship'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Salary</label>
            <input name="salary" value={form.salary} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="input min-h-[120px] resize-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Requirements *</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange}
              className="input min-h-[100px] resize-none" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
