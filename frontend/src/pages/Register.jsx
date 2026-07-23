import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import logoImage from '../../image/image 1.png';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const { email, password, firstName, lastName, phone, address } = formData;
      const res = await register({ email, password, firstName, lastName, phone, address });
      setSuccess(res.message || 'Registration successful! Verification email sent.');
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-transparent">
      {/* Decorative glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/50 rounded-full blur-[80px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-300/40 rounded-full blur-[100px] animate-pulse-slow"></div>

      <div className="w-full max-w-xl p-8 rounded-[24px] glass relative z-10 shadow-[0_8px_32px_rgba(0,120,255,0.1)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Bin Uthman Water Logo" className="w-24 h-24 object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white">Create Account</h1>
          <p className="text-slate-400 mt-2 text-sm">Join Bin Uthman Water to start ordering</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-5 h-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-[#1e3a8a]">Verification Link Sent!</span>
            </div>
            <p>{success}</p>
            <div className="mt-3 p-2 bg-white/80 rounded border border-emerald-100 text-xs text-slate-600 font-mono">
              Tip: In development, open <strong>backend/database/emails.log</strong> to find the verification link!
            </div>
            <div className="mt-4 flex justify-end">
              <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20">
                Proceed to Login
              </Link>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
                  placeholder="+2348012345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Default Delivery Address</label>
              <textarea
                name="address"
                rows="2"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none shadow-sm"
                placeholder="Street address, building, apartment, city, state"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm pr-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm pr-10"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
