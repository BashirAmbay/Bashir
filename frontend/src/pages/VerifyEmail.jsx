import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.auth.verifyEmail(token);
        setStatus('success');
        setMessage(res.message || 'Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification link is invalid or has expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-transparent">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-200/50 rounded-full blur-[80px] animate-pulse-slow"></div>
      
      <div className="w-full max-w-md p-8 rounded-[24px] glass text-center relative z-10 shadow-[0_8px_32px_rgba(0,120,255,0.1)]">
        <h1 className="text-2xl font-bold font-display text-[#1e3a8a] mb-6">Email Verification</h1>

        {status === 'verifying' && (
          <div className="space-y-4 py-6">
            <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-600">Validating token and activating your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 py-4">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">Email Verified!</p>
              <p className="text-sm text-slate-500 mt-2">{message}</p>
            </div>
            <Link to="/login" className="block w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-colors">
              Continue to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 py-4">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full text-red-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-red-600">Verification Failed</p>
              <p className="text-sm text-slate-500 mt-2">{message}</p>
            </div>
            <div className="space-y-3">
              <Link to="/register" className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                Back to Registration
              </Link>
              <Link to="/login" className="block text-sm text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
