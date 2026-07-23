import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Request Reset States
  const [email, setEmail] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  // Perform Reset States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');
    setRequestLoading(true);

    try {
      const res = await api.auth.requestPasswordReset(email);
      setRequestSuccess(res.message || 'Password reset link sent to your email.');
    } catch (err) {
      setRequestError(err.message || 'Failed to request password reset.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handlePerformReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword !== confirmPassword) {
      return setResetError('Passwords do not match');
    }

    setResetLoading(true);

    try {
      const res = await api.auth.resetPassword(token, newPassword);
      setResetSuccess(res.message || 'Password reset successfully! You can now log in.');
    } catch (err) {
      setResetError(err.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-transparent">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/50 rounded-full blur-[80px] animate-pulse-slow"></div>

      <div className="w-full max-w-md p-8 rounded-[24px] glass relative z-10 shadow-[0_8px_32px_rgba(0,120,255,0.1)]">
        <h1 className="text-2xl font-bold font-display text-[#1e3a8a] text-center mb-6">Reset Password</h1>

        {/* FLOW 1: Request Password Reset link (No Token) */}
        {!token && (
          <div>
            {requestError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {requestError}
              </div>
            )}

            {requestSuccess && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                  {requestSuccess}
                </div>
                <div className="p-3 bg-white/80 border border-slate-200 rounded text-xs font-mono text-slate-600">
                  Tip: In development, open <strong>backend/database/emails.log</strong> to find the password reset link!
                </div>
                <Link to="/login" className="block text-center text-sm text-blue-600 hover:underline mt-4">
                  Back to Login
                </Link>
              </div>
            )}

            {!requestSuccess && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-sm text-slate-500 text-center mb-4">
                  Enter your email address and we will send you a link to reset your password.
                </p>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={requestLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  {requestLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-blue-600 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        )}

        {/* FLOW 2: Complete Reset using Token */}
        {token && (
          <div>
            {resetError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="space-y-4 text-center">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                  {resetSuccess}
                </div>
                <Link to="/login" className="block w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30">
                  Go to Login
                </Link>
              </div>
            )}

            {!resetSuccess && (
              <form onSubmit={handlePerformReset} className="space-y-4">
                <p className="text-sm text-slate-500 text-center mb-4">
                  Enter your new password below.
                </p>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-colors"
                >
                  {resetLoading ? 'Resetting password...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
