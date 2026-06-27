import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  ArrowLeft, 
  MessageSquare, 
  Lock, 
  Clock, 
  User, 
  Send, 
  Edit, 
  Trash2, 
  UserCheck,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCustomer, isAgent, isAdmin } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activity, setActivity] = useState([]);
  const [agents, setAgents] = useState([]);
  
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'notes' | 'activity'
  const [commentInput, setCommentInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      const [ticketRes, commentRes, activityRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/comments`),
        api.get(`/tickets/${id}/activity`),
      ]);
      setTicket(ticketRes.data);
      setComments(commentRes.data || []);
      setActivity(activityRes.data || []);

      if (!isCustomer) {
        const noteRes = await api.get(`/tickets/${id}/notes`);
        setNotes(noteRes.data || []);
        const usersRes = await api.get('/users');
        setAgents(usersRes.data.filter(u => u.role === 'agent' || u.role === 'admin') || []);
      }
    } catch (err) {
      console.error('Failed to fetch ticket', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/tickets/${id}`, { status: newStatus });
      fetchTicketDetails();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleAssignAgent = async (agentId) => {
    try {
      await api.put(`/tickets/${id}`, { assigned_agent_id: agentId ? parseInt(agentId) : null });
      fetchTicketDetails();
    } catch (e) {
      alert('Failed to reassign agent');
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/tickets/${id}/comments`, { content: commentInput });
      setCommentInput('');
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/tickets/${id}/notes`, { body: noteInput });
      setNoteInput('');
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to post note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await api.delete(`/tickets/${id}`);
      navigate('/tickets');
    } catch (e) {
      alert('Failed to delete ticket');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  if (!ticket) {
    return <div className="text-center py-12 text-slate-400">Ticket not found.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Back button and Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/tickets/${id}/edit`)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Ticket
          </button>
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                {ticket.ticket_number}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
              {ticket.title}
            </h1>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Interactive Threads Tabs */}
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex-1 py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                  activeTab === 'comments'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Public Replies ({comments.length})
              </button>

              {!isCustomer && (
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                    activeTab === 'notes'
                      ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400" /> Internal Team Notes ({notes.length})
                </button>
              )}

              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-4 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                  activeTab === 'activity'
                    ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" /> Timeline ({activity.length})
              </button>
            </div>

            <div className="p-6">
              {/* PUBLIC COMMENTS TAB */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {comments.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No replies posted yet.</p>
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                                {c.user?.name?.charAt(0) || 'U'}
                              </div>
                              <span className="text-xs font-semibold text-slate-200">{c.user?.name}</span>
                              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                {c.user?.role}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500">{new Date(c.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 pl-9 whitespace-pre-wrap">{c.content || c.body}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handlePostComment} className="pt-4 border-t border-slate-800">
                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a public response to the customer..."
                      className="w-full bg-slate-900/90 text-xs sm:text-sm text-slate-200 placeholder-slate-500 p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={submitting || !commentInput.trim()}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" /> Post Reply
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* INTERNAL NOTES TAB */}
              {activeTab === 'notes' && !isCustomer && (
                <div className="space-y-6">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Private Internal Notes are visible only to agents and administrators. Customers cannot see this stream.</span>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {notes.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No internal notes added yet.</p>
                    ) : (
                      notes.map((n) => (
                        <div key={n.id} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                                {n.user?.name?.charAt(0) || 'A'}
                              </div>
                              <span className="text-xs font-semibold text-slate-200">{n.user?.name}</span>
                            </div>
                            <span className="text-[11px] text-slate-500">{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 pl-9 whitespace-pre-wrap">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handlePostNote} className="pt-4 border-t border-slate-800">
                    <textarea
                      rows={3}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add private team note (e.g. engineering investigation status)..."
                      className="w-full bg-slate-900/90 text-xs sm:text-sm text-slate-200 placeholder-slate-500 p-4 rounded-2xl border border-amber-500/30 focus:outline-none focus:border-amber-500 transition"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={submitting || !noteInput.trim()}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-2 transition disabled:opacity-50"
                      >
                        <Lock className="w-3.5 h-3.5" /> Add Internal Note
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === 'activity' && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activity.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No activity recorded yet.</p>
                  ) : (
                    activity.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 text-xs">
                        <div className="p-1.5 rounded-full bg-slate-800 text-indigo-400 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-200 font-medium">
                            <span className="font-semibold text-indigo-300">{act.user?.name || 'System'}</span> performed{' '}
                            <span className="font-semibold text-white">{act.action}</span>
                          </p>
                          <span className="text-[10px] text-slate-500">{new Date(act.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info & Controls (Right 1 column) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-semibold text-base text-white border-b border-slate-800 pb-3">Ticket Properties</h3>

            {!isCustomer && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Update Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assigned Agent</label>
                  <select
                    value={ticket.assigned_agent_id || ''}
                    onChange={(e) => handleAssignAgent(e.target.value)}
                    className="w-full bg-slate-900 text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>{ag.name} ({ag.role})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Requester</span>
                <span className="font-semibold text-slate-200">{ticket.customer?.name || 'Customer'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Category</span>
                <span className="font-semibold text-slate-200">{ticket.category}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> SLA Target</span>
                <span className={`font-semibold ${ticket.sla_breached ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                  {ticket.sla_breached ? 'SLA BREACHED' : new Date(ticket.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
