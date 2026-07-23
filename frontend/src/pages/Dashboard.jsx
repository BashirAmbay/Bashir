import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { api } from '../services/api.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // New Booking form state
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    deliveryAddress: user?.address || '',
    preferredDeliveryDate: '',
    notes: ''
  });
  const [orderError, setOrderError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  // New Report form state
  const [reportForm, setReportForm] = useState({
    bookingId: '',
    type: 'complaint',
    subject: '',
    description: '',
    attachments: ''
  });
  const [reportError, setReportError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // General error state
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const bookingsList = await api.bookings.list();
      setBookings(bookingsList);
      
      const reportsList = await api.reports.list();
      setReports(reportsList);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set default address when user profile loads
  useEffect(() => {
    if (user?.address) {
      setOrderForm(prev => ({ ...prev, deliveryAddress: user.address }));
    }
  }, [user]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setOrderError('');
    setOrderLoading(true);

    try {
      await api.bookings.create({
        quantity: parseFloat(orderForm.quantity),
        deliveryAddress: orderForm.deliveryAddress,
        preferredDeliveryDate: orderForm.preferredDeliveryDate,
        notes: orderForm.notes
      });
      setShowOrderModal(false);
      setOrderForm({
        quantity: '',
        deliveryAddress: user?.address || '',
        preferredDeliveryDate: '',
        notes: ''
      });
      fetchData();
    } catch (err) {
      setOrderError(err.message || 'Failed to place booking.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.bookings.updateStatus(bookingId, 'cancelled');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  const handlePayBooking = async (bookingId) => {
    try {
      const res = await api.bookings.pay(bookingId);
      if (res.authorization_url) {
        window.location.href = res.authorization_url; // Redirect to Paystack
      }
    } catch (err) {
      alert(err.message || 'Failed to initialize payment.');
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setReportError('');
    setReportLoading(true);

    try {
      await api.reports.create({
        bookingId: reportForm.bookingId ? parseInt(reportForm.bookingId) : null,
        type: reportForm.type,
        subject: reportForm.subject,
        description: reportForm.description,
        attachments: reportForm.attachments
      });
      setShowReportModal(false);
      setReportForm({
        bookingId: '',
        type: 'complaint',
        subject: '',
        description: '',
        attachments: ''
      });
      fetchData();
    } catch (err) {
      setReportError(err.message || 'Failed to submit feedback.');
    } finally {
      setReportLoading(false);
    }
  };

  // Metrics
  const totalWaterOrdered = bookings.reduce((sum, b) => b.status === 'completed' ? sum + b.quantity : sum, 0);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize">Pending</span>;
      case 'approved':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 capitalize">Approved</span>;
      case 'assigned':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">Assigned</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 capitalize">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-400 capitalize">{status}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    if (status === 'paid') return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">Paid</span>;
    if (status === 'failed') return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 capitalize">Failed</span>;
    return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-400 capitalize">Unpaid</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-[#1e3a8a]">Welcome, {user?.firstName}!</h1>
          <p className="text-slate-600 mt-1">Manage your water orders, delivery addresses, and feedback tickets.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowOrderModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Request Water Delivery</span>
          </button>
          <button 
            onClick={() => setShowReportModal(true)}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Submit Ticket</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Metrics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute right-4 bottom-4 text-blue-500/10">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Water Delivered</p>
          <p className="text-3xl font-bold font-display text-slate-800 mt-2">{totalWaterOrdered} Liters</p>
        </div>

        <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute right-4 bottom-4 text-amber-500/10">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Bookings</p>
          <p className="text-3xl font-bold font-display text-slate-800 mt-2">{pendingCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute right-4 bottom-4 text-emerald-500/10">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Completed Orders</p>
          <p className="text-3xl font-bold font-display text-slate-800 mt-2">{completedCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-500 text-sm">Fetching your booking logs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Bookings List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold font-display text-[#1e3a8a] mb-4">Water Booking History</h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-500 text-sm">You haven't requested any deliveries yet.</p>
                  <button 
                    onClick={() => setShowOrderModal(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow"
                  >
                    Place Your First Request
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-800">Order #{booking.id}</span>
                          {getStatusBadge(booking.status)}
                          {getPaymentBadge(booking.paymentStatus)}
                        </div>
                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          <p><span className="font-semibold text-slate-700">Quantity:</span> {booking.quantity} Liters</p>
                          <p><span className="font-semibold text-slate-700">Address:</span> {booking.deliveryAddress}</p>
                          <p>
                            <span className="font-semibold text-slate-700">Delivery Date:</span>{' '}
                            {new Date(booking.preferredDeliveryDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          {booking.notes && <p><span className="font-semibold text-slate-700">Notes:</span> "{booking.notes}"</p>}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {booking.status === 'pending' && booking.paymentStatus !== 'paid' && (
                          <button 
                            onClick={() => handlePayBooking(booking.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all shadow"
                          >
                            Pay Now
                          </button>
                        )}
                        {booking.status === 'pending' && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 text-xs font-semibold rounded-lg transition-all"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feedback Reports List */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold font-display text-[#1e3a8a] mb-4">My Tickets & Feedback</h2>
              
              {reports.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No issues or complaints submitted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800 capitalize">{report.type} #{report.id}</span>
                        <span className={`px-2 py-0.5 rounded-full uppercase text-[10px] font-bold ${
                          report.status === 'open' ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                          report.status === 'in_progress' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                          report.status === 'resolved' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">Subject: {report.subject}</p>
                        <p className="text-slate-600 mt-1">{report.description}</p>
                        {report.bookingId && <p className="text-slate-500 mt-1">Linked to Order #{report.bookingId}</p>}
                      </div>
                      
                      {report.adminResponse && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="font-semibold text-blue-700">Admin Response:</p>
                          <p className="text-slate-700 mt-1 italic">"{report.adminResponse}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: Place Booking Order */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold font-display text-[#1e3a8a] mb-6">Request Water Delivery</h2>
            
            {orderError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {orderError}
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Quantity (Liters)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  step="any"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. 25"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Delivery Address</label>
                <textarea 
                  required
                  rows="2"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="Street address where water should be delivered"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Preferred Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={orderForm.preferredDeliveryDate}
                  onChange={(e) => setOrderForm({ ...orderForm, preferredDeliveryDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Notes for Driver (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. Drop at gate"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={orderLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow flex items-center gap-2"
                >
                  {orderLoading ? 'Placing Request...' : 'Place Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Submit Complaint Ticket */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold font-display text-[#1e3a8a] mb-6">Submit Ticket / Feedback</h2>
            
            {reportError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {reportError}
              </div>
            )}

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Ticket Type</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                    value={reportForm.type}
                    onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                  >
                    <option value="complaint">Complaint</option>
                    <option value="feedback">General Feedback</option>
                    <option value="issue">Service Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Link Order (Optional)</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                    value={reportForm.bookingId}
                    onChange={(e) => setReportForm({ ...reportForm, bookingId: e.target.value })}
                  >
                    <option value="">No Linked Order</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>Order #{b.id} ({b.quantity}L)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. Delayed Delivery"
                  value={reportForm.subject}
                  onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="Describe your issue or feedback in detail..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">Attachments Link (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. Photo link or URL"
                  value={reportForm.attachments}
                  onChange={(e) => setReportForm({ ...reportForm, attachments: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={reportLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow flex items-center gap-2"
                >
                  {reportLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
