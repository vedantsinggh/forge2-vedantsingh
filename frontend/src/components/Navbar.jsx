import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { Search, LogOut, User as UserIcon, Building, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data);
      setShowSearchModal(true);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Global search (tickets, comments, users)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/90 text-xs sm:text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition"
        />
      </form>

      {/* Global Search Results Modal */}
      {showSearchModal && searchResults && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4" onClick={() => setShowSearchModal(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl glass-panel" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" /> Search Results for "{searchQuery}"
              </h3>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-6 pt-4">
              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Tickets ({searchResults.tickets.length})</h4>
                {searchResults.tickets.length === 0 ? <p className="text-xs text-slate-500">No tickets found</p> : (
                  <div className="space-y-2">
                    {searchResults.tickets.map(t => (
                      <div key={t.id} onClick={() => { navigate(`/tickets/${t.id}`); setShowSearchModal(false); }} className="p-3 rounded-lg bg-slate-800/40 hover:bg-indigo-500/10 border border-slate-700/50 cursor-pointer flex justify-between items-center">
                        <div>
                          <span className="text-xs font-mono text-indigo-400 font-semibold">{t.ticket_number}</span>
                          <p className="text-sm font-medium text-slate-200">{t.title}</p>
                        </div>
                        <span className="text-xs text-slate-400">{t.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Tenant badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold">{user?.organization?.name || 'PulseDesk Org'}</span>
        </div>

        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

        {/* User context menu */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
