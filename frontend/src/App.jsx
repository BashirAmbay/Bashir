import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Navbar from './components/Navbar.jsx';
import PublicLayout from './components/PublicLayout.jsx';

// Public Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import Services from './pages/Services.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';

// Auth & Dashboard Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Profile from './pages/Profile.jsx';

// Protected Route for Authenticated Users
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-white to-[#bae6fd]">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Protected Route for Admins only
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-white to-[#bae6fd]">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Layout wrapper for existing dashboard/auth pages to maintain their original background
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-white to-[#bae6fd] text-slate-800 flex flex-col font-sans relative">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Landing Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
            </Route>

            {/* Auth & Dashboard Routes */}
            <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
            <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
            <Route path="/verify-email" element={<AppLayout><VerifyEmail /></AppLayout>} />
            <Route path="/reset-password" element={<AppLayout><ResetPassword /></AppLayout>} />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <AppLayout><Profile /></AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AppLayout><AdminDashboard /></AppLayout>
                </AdminRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}
