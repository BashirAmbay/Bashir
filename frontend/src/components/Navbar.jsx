import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 glass border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 group-hover:bg-sky-500/20 transition-colors">
            <svg className="w-6 h-6 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
            BinUthman Water
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user.role === 'customer' ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/dashboard') ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/admin" 
                className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/admin') ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`}
              >
                Admin Panel
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/dashboard') ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`}
              >
                Bookings Feed
              </Link>
            </>
          )}

          <Link 
            to="/profile" 
            className={`text-sm font-semibold tracking-wide transition-colors ${isActive('/profile') ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`}
          >
            Profile
          </Link>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-sky-400 capitalize font-medium">{user.role}</p>
          </div>
          
          {/* Divider */}
          <span className="w-px h-6 bg-slate-800 hidden sm:block"></span>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/30 text-slate-300 hover:text-red-200 text-xs font-semibold rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
