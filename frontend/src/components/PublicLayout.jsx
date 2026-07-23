import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar.jsx';
import PublicFooter from './PublicFooter.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <PublicNavbar />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
