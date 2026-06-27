import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  Ticket, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const { metrics, by_status, by_priority, recently_updated, sla_warnings } = data;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Support Operations Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time multi-tenant ticketing overview & SLA performance metrics
          </p>
        </div>
        <button
          onClick={() => navigate('/tickets/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Tickets</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-white mt-4">{metrics.open_tickets}</p>
          <span className="text-[11px] text-slate-500 mt-2 block">Active unresolved customer issues</span>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned Tickets</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-white mt-4">{metrics.assigned_tickets}</p>
          <span className="text-[11px] text-slate-500 mt-2 block">Assigned to your queue</span>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">SLA Warnings</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-rose-400 mt-4">{metrics.sla_warnings}</p>
          <span className="text-[11px] text-slate-500 mt-2 block">Breached or due within 4h</span>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Volume</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-white mt-4">{metrics.total_tickets}</p>
          <span className="text-[11px] text-slate-500 mt-2 block">Lifetime tenant tickets</span>
        </div>
      </div>

      {/* Simple Charts & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-semibold text-base text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Ticket Status Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(by_status).map(([status, count]) => {
              const percentage = metrics.total_tickets > 0 ? Math.round((count / metrics.total_tickets) * 100) : 0;
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{status}</span>
                    <span className="text-slate-400">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-semibold text-base text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Ticket Priority Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(by_priority).map(([priority, count]) => {
              const percentage = metrics.total_tickets > 0 ? Math.round((count / metrics.total_tickets) * 100) : 0;
              const barColors = {
                Critical: 'from-rose-500 to-red-600',
                High: 'from-orange-500 to-amber-600',
                Medium: 'from-sky-500 to-blue-600',
                Low: 'from-slate-500 to-slate-600',
              };
              return (
                <div key={priority} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{priority}</span>
                    <span className="text-slate-400">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${barColors[priority] || 'from-indigo-500 to-violet-500'} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SLA Warnings Alert Section */}
      {sla_warnings && sla_warnings.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
            <h3 className="font-semibold text-base text-rose-300">SLA Attention Required ({sla_warnings.length})</h3>
          </div>
          <div className="divide-y divide-slate-800/60">
            {sla_warnings.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/tickets/${t.id}`)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer hover:bg-rose-500/10 p-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-rose-400">{t.ticket_number}</span>
                  <p className="text-sm font-medium text-slate-200">{t.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <PriorityBadge priority={t.priority} />
                  <span className="text-xs text-rose-400 font-medium">
                    {t.sla_breached ? 'BREACHED' : `Due: ${new Date(t.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Updated Tickets Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="font-semibold text-base text-white">Recently Updated Tickets</h3>
          <button
            onClick={() => navigate('/tickets')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">Ticket #</th>
                <th className="px-6 py-3.5">Subject</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Assigned Agent</th>
                <th className="px-6 py-3.5">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recently_updated.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="px-6 py-4 font-mono font-bold text-indigo-400">{t.ticket_number}</td>
                  <td className="px-6 py-4 font-medium text-slate-100 max-w-xs truncate">{t.title}</td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-4"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-6 py-4 text-slate-400">{t.assigned_agent?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(t.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
