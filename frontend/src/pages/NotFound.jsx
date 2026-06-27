import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/20">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-2">404 — Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        The requested support route or resource does not exist or may have been relocated.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition"
      >
        <Home className="w-4 h-4" /> Return to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
