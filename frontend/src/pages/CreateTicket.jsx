import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Send, Ticket } from 'lucide-react';

export const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/tickets', {
        title,
        description,
        priority,
        category,
      });
      navigate(`/tickets/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/tickets')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tickets
      </button>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-400" /> Create New Support Ticket
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Submit a new request to the technical support team</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Subject / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unable to access billing invoice PDF"
              className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-500 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-white p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Low">Low (24h SLA)</option>
                <option value="Medium">Medium (8h SLA)</option>
                <option value="High">High (4h SLA)</option>
                <option value="Critical">Critical (1h Urgent SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-white p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="General">General Inquiries</option>
                <option value="Billing">Billing & Accounting</option>
                <option value="Technical">Technical Issue / Bug</option>
                <option value="Feature Request">Feature Request</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Detailed Description</label>
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide full steps to reproduce, error logs, or relevant details..."
              className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-500 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? 'Submitting Ticket...' : 'Submit Support Ticket'} <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
