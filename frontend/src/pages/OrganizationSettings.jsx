import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building, Save, Shield } from 'lucide-react';

export const OrganizationSettings = () => {
  const [org, setOrg] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await api.get('/organization');
        setOrg(res.data);
        setName(res.data.name);
      } catch (e) {
        console.error('Failed to fetch org settings', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/organization', { name });
      setOrg(res.data);
      alert('Organization settings updated successfully');
    } catch (e) {
      alert('Failed to update organization settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building className="w-6 h-6 text-indigo-400" /> Organization Settings
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage tenant identity and global branding</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Organization Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/90 text-sm text-white p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tenant Slug</label>
            <input
              type="text"
              disabled
              value={org?.slug || ''}
              className="w-full bg-slate-900/40 text-sm text-slate-500 p-3.5 rounded-xl border border-slate-800/60 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-500 mt-1">Unique tenant identifier used for isolated database queries.</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>Strict multi-tenant isolation guarantees that all organization data remains completely segmented and encrypted.</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSettings;
