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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="w-full max-w-md p-8 rounded-2xl glass relative z-10 shadow-2xl">
        <h1 className="text-2xl font-bold font-display text-white text-center mb-6">Reset Password</h1>

        {/* FLOW 1: Request Password Reset link (No Token) */}
        {!token && (
          <div>
            {requestError && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {requestError}
              </div>
            )}

            {requestSuccess && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-200 text-sm">
                  {requestSuccess}
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-300">
                  Tip: In development, open <strong>backend/database/emails.log</strong> to find the password reset link!
                </div>
                <Link to="/login" className="block text-center text-sm text-sky-400 hover:underline mt-4">
                  Back to Login
                </Link>
              </div>
            )}

            {!requestSuccess && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-sm text-slate-400 text-center mb-4">
                  Enter your email address and we will send you a link to reset your password.
                </p>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={requestLoading}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {requestLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-sky-400 hover:underline">
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
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="space-y-4 text-center">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-200 text-sm">
                  {resetSuccess}
                </div>
                <Link to="/login" className="block w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors">
                  Go to Login
                </Link>
              </div>
            )}

            {!resetSuccess && (
              <form onSubmit={handlePerformReset} className="space-y-4">
                <p className="text-sm text-slate-400 text-center mb-4">
                  Enter your new password below.
                </p>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-semibold rounded-xl shadow-lg transition-colors"
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
