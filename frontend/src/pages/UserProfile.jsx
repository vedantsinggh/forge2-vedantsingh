import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Building, Calendar } from 'lucide-react';

export const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {user?.role} Account
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Building className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Organization</p>
              <p className="text-white font-medium">{user?.organization?.name || 'PulseDesk Tenant'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Mail className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Primary Email Address</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">System Privileges</p>
              <p className="text-white font-medium">
                {user?.role === 'admin' ? 'Administrator • Full system control & user management' : user?.role === 'agent' ? 'Support Agent • Ticket resolution & internal notes' : 'End Customer • Support ticket creation'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
