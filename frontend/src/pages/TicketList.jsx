import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

export const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const statusFilter = searchParams.get('status') || '';
  const priorityFilter = searchParams.get('priority') || '';
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrder = searchParams.get('sort_order') || 'desc';
  const page = searchParams.get('page') || '1';

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        q: searchQuery,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: page,
      });
      const res = await api.get(`/tickets?${params.toString()}`);
      setTickets(res.data.data || []);
      setMeta({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
      });
    } catch (err) {
      console.error('Failed to fetch tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSort = (column) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortBy === column) {
      newParams.set('sort_order', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      newParams.set('sort_by', column);
      newParams.set('sort_order', 'desc');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">Support Tickets</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage and resolve organization support requests</p>
        </div>
        <button
          onClick={() => navigate('/tickets/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => updateFilter('q', e.target.value)}
            className="w-full bg-slate-900/90 text-xs sm:text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filters:
          </div>

          <select
            value={statusFilter}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-slate-400 text-sm">No tickets found matching your query filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold select-none">
                <tr>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('ticket_number')}>
                    <div className="flex items-center gap-1">Ticket # <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('priority')}>
                    <div className="flex items-center gap-1">Priority <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Requester</th>
                  <th className="px-6 py-4">Assignee</th>
                  <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center gap-1">Created <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-indigo-400">{t.ticket_number}</td>
                    <td className="px-6 py-4 font-semibold text-slate-100 max-w-xs truncate">{t.title}</td>
                    <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                    <td className="px-6 py-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-6 py-4 text-slate-400">{t.category}</td>
                    <td className="px-6 py-4 text-slate-300">{t.customer?.name || 'Customer'}</td>
                    <td className="px-6 py-4 text-slate-400">{t.assigned_agent?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {meta.last_page > 1 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-200">{meta.current_page}</span> of{' '}
              <span className="font-semibold text-slate-200">{meta.last_page}</span> ({meta.total} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.current_page === 1}
                onClick={() => updateFilter('page', meta.current_page - 1)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={meta.current_page === meta.last_page}
                onClick={() => updateFilter('page', meta.current_page + 1)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
