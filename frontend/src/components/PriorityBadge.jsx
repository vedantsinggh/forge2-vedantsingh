import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const normalized = priority ? priority.toLowerCase() : 'medium';

  const styles = {
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold',
    urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const styleClass = styles[normalized] || styles.medium;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${styleClass}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
