import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  Users, 
  Building, 
  User, 
  Settings,
  Activity
} from 'lucide-react';

export const Sidebar = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
  ];

  const adminItems = [
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Organization', path: '/settings/org', icon: Building },
  ];

  const accountItems = [
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
      isActive
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
    }`;

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white tracking-tight">PulseDesk</h1>
            <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest">Forge 2 SaaS</p>
          </div>
        </div>

        {/* Core Navigation */}
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3.5 mb-2">Main Menu</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} className={linkClass}>
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {isAdmin && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3.5 mb-2">Administration</p>
              <nav className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.path} to={item.path} className={linkClass}>
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3.5 mb-2">Account</p>
            <nav className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} className={linkClass}>
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 text-center">
        <p className="text-[11px] text-slate-500">PulseDesk v1.0 • Forge 2 Edition</p>
      </div>
    </aside>
  );
};

export default Sidebar;
