import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

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
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Configure your contact details and default delivery destination.</p>
      </div>

      <div className="p-8 rounded-2xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl"></div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-sm rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* Read-only account info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-800/60">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Email Address</p>
              <p className="text-white mt-1.5 font-semibold font-mono">{user?.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Account Role</p>
              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-sky-400 border border-slate-700 mt-1.5 capitalize">
                {user?.role} Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Default Delivery Address</label>
            <textarea
              name="address"
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-none"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
