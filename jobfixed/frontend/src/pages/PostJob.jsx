import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createJob } from '../utils/api';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'full-time',
    salary: '', description: '', requirements: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createJob(form);
      toast.success('Job posted!');
      navigate(`/jobs/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Post a New Job</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                className="input" placeholder="e.g. React Developer" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Company *</label>
              <input name="company" value={form.company} onChange={handleChange}
                className="input" placeholder="e.g. 10Pearls" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Location *</label>
              <input name="location" value={form.location} onChange={handleChange}
                className="input" placeholder="e.g. Karachi / Remote" required />
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
            <input name="salary" value={form.salary} onChange={handleChange}
              className="input" placeholder="e.g. PKR 50,000 – 80,000 / month" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="input min-h-[120px] resize-none"
              placeholder="Describe the role and responsibilities..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Requirements *</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange}
              className="input min-h-[100px] resize-none"
              placeholder="Skills, experience, and qualifications..." required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Posting...' : 'Post Job'}
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
