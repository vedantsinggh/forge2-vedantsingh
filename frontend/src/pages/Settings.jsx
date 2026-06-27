import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" /> Account Settings
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">Configure your workspace preferences and security</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-6 divide-y divide-slate-800">
          <div className="pt-4 first:pt-0 flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <Bell className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Email Notifications</h3>
                <p className="text-xs text-slate-400 mt-0.5">Receive email alerts when tickets are updated or assigned.</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="mt-1 accent-indigo-600 w-4 h-4 rounded" />
          </div>

          <div className="pt-6 flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security to your support account.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-indigo-300 border border-slate-800">
              Configure 2FA
            </button>
          </div>

          <div className="pt-6 flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <Palette className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white">Interface Theme</h3>
                <p className="text-xs text-slate-400 mt-0.5">PulseDesk features modern glassmorphism dark theme by default.</p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 font-semibold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Dark Glass Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
