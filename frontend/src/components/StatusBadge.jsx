import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = status ? status.toLowerCase().replace(' ', '_') : 'open';
  
  const styles = {
    open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    in_progress: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    resolved: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const dots = {
    open: 'bg-emerald-400',
    in_progress: 'bg-indigo-400 animate-pulse',
    pending: 'bg-amber-400',
    resolved: 'bg-purple-400',
    closed: 'bg-slate-400',
  };

  const styleClass = styles[normalized] || styles.open;
  const dotClass = dots[normalized] || dots.open;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
