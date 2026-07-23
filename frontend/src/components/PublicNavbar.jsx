import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Menu, X, Droplets, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group relative z-50">
            <div className="p-2 bg-sky-500 rounded-xl text-white group-hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20">
              <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-slate-900 transition-colors">
              BinUthman Water
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions (Login / Dashboard) */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Link 
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-sky-500/25 transition-all group"
              >
                Dashboard
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-sky-500/25 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden relative z-50 p-2 rounded-lg text-slate-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl lg:hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-2 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-sky-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-slate-100 my-2"></div>
              
              {user ? (
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-xl font-semibold"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
