import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { api } from '../services/api.js';

export default function AdminDashboard() {
  const { user: currentAdmin } = useAuth();
  
  // Data lists
  const [allBookings, setAllBookings] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [driverAssignments, setDriverAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI Tabs: 'bookings', 'assignments', 'reports', 'users'
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Selection/Modals state
  const [assigningBooking, setAssigningBooking] = useState(null); // booking object
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [respondingReport, setRespondingReport] = useState(null); // report object
  const [adminResponseText, setAdminResponseText] = useState('');
  const [reportStatus, setReportStatus] = useState('resolved');
  
  // Driver workflow states
  const [updatingAssignment, setUpdatingAssignment] = useState(null); // assignment object
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('completed');

  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const bookings = await api.bookings.list();
      setAllBookings(bookings);
      
      const reports = await api.reports.list();
      setAllReports(reports);

      const users = await api.users.listAll();
      setAllUsers(users);

      const assignments = await api.assignments.list();
      setDriverAssignments(assignments);
    } catch (err) {
      setError(err.message || 'Failed to load administrator data panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateBookingStatus = async (bookingId, status) => {
    if (!window.confirm(`Are you sure you want to change booking #${bookingId} status to '${status}'?`)) return;
    try {
      await api.bookings.updateStatus(bookingId, status);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update booking status.');
    }
  };

  const handleAssignDriver = async (e) => {
    e.preventDefault();
    if (!selectedDriverId) return alert('Please select a driver/admin');
    
    try {
      await api.bookings.assign(assigningBooking.id, parseInt(selectedDriverId));
      setAssigningBooking(null);
      setSelectedDriverId('');
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to assign delivery.');
    }
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.assignments.updateStatus(updatingAssignment.id, deliveryStatus, deliveryNotes);
      setUpdatingAssignment(null);
      setDeliveryNotes('');
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update delivery assignment.');
    }
  };

  const handleRespondReport = async (e) => {
    e.preventDefault();
    if (!adminResponseText) return alert('Please enter a response message');
    
    try {
      await api.reports.respond(respondingReport.id, adminResponseText, reportStatus);
      setRespondingReport(null);
      setAdminResponseText('');
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to send response.');
    }
  };

  const handleUserConfig = async (userId, settings) => {
    try {
      await api.users.updateStatus(userId, settings);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update user settings.');
    }
  };

  // Extract all admins for assignment dropdown
  const adminUsers = allUsers.filter(u => u.role === 'admin' && u.isActive);

  // Stats calculation
  const totalBookingsCount = allBookings.length;
  const activeUsersCount = allUsers.filter(u => u.isActive && u.role === 'customer').length;
  const pendingDeliveriesCount = allBookings.filter(b => b.status === 'pending' || b.status === 'approved' || b.status === 'assigned').length;
  const openReportsCount = allReports.filter(r => r.status === 'open' || r.status === 'in_progress').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize">Pending</span>;
      case 'approved':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 capitalize">Approved</span>;
      case 'assigned':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">Assigned</span>;
      case 'completed':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 capitalize">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-400 capitalize">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-white">Administrator Control Panel</h1>
        <p className="text-slate-400 mt-1">Oversee water orders, manage logistics assignments, respond to client tickets, and configure accounts.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="p-5 rounded-2xl glass-panel">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Booking Tickets</p>
          <p className="text-2xl font-bold text-white mt-1">{totalBookingsCount}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Customers</p>
          <p className="text-2xl font-bold text-white mt-1">{activeUsersCount}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Logistical Orders</p>
          <p className="text-2xl font-bold text-sky-400 mt-1">{pendingDeliveriesCount}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Open Complaints</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{openReportsCount}</p>
        </div>
      </div>

      {/* Driver Work Section (If assigned any deliveries) */}
      {driverAssignments.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl glass border border-sky-500/20 bg-sky-950/5">
          <h2 className="text-lg font-bold font-display text-sky-400 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 16h6a1 1 0 001-1v-4a1 1 0 00-.81-.98l-2.61-.87a1 1 0 00-.77.1L13 11m0 5H9m4 0h2" />
            </svg>
            <span>My Assigned Deliveries (Driver Dispatch Tasklist)</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driverAssignments.map((assign) => (
              <div key={assign.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Delivery ID #{assign.id} (Booking #{assign.bookingId})</span>
                    <span className={`px-2 py-0.5 rounded-full capitalize font-semibold ${
                      assign.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      assign.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      assign.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {assign.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-slate-400">
                    <p><span className="font-medium text-slate-300">Customer:</span> {assign.customerFirstName} {assign.customerLastName} ({assign.customerPhone})</p>
                    <p><span className="font-medium text-slate-300">Quantity:</span> {assign.quantity} Liters</p>
                    <p><span className="font-medium text-slate-300">Destination:</span> {assign.deliveryAddress}</p>
                    <p>
                      <span className="font-medium text-slate-300">Preferred Date:</span>{' '}
                      {new Date(assign.preferredDeliveryDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    {assign.bookingNotes && <p><span className="font-medium text-slate-300">Booking Notes:</span> "{assign.bookingNotes}"</p>}
                    {assign.deliveryNotes && <p><span className="font-medium text-slate-300">My Notes:</span> "{assign.deliveryNotes}"</p>}
                  </div>
                </div>

                {assign.status !== 'completed' && (
                  <div className="pt-2 flex justify-end">
                    <button 
                      onClick={() => {
                        setUpdatingAssignment(assign);
                        setDeliveryStatus(assign.status === 'pending' ? 'in_progress' : 'completed');
                        setDeliveryNotes(assign.deliveryNotes || '');
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow transition-colors"
                    >
                      Update Delivery Status
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tabbed Panels */}
      <div className="p-6 rounded-2xl glass-panel">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-4 mb-6 pb-2 overflow-x-auto">
          {['bookings', 'reports', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold pb-2 border-b-2 transition-all capitalize whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-sky-500 text-sky-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'reports' ? 'Complaints & Tickets' : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div>
            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Delivery Date</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Assigned To</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {allBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/20">
                        <td className="py-4 px-4 font-semibold text-slate-300">#{b.id}</td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-white">{b.firstName} {b.lastName}</p>
                          <p className="text-slate-500 font-mono text-[10px]">{b.phone || b.email}</p>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-300">{b.quantity}L</td>
                        <td className="py-4 px-4 text-slate-400">
                          {new Date(b.preferredDeliveryDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="py-4 px-4 text-slate-400 max-w-xs truncate" title={b.deliveryAddress}>
                          {b.deliveryAddress}
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(b.status)}</td>
                        <td className="py-4 px-4 text-slate-300">
                          {b.driverFirstName ? (
                            <span className="text-indigo-300 font-medium">@{b.driverFirstName} {b.driverLastName}</span>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'approved')}
                                className="px-2.5 py-1 bg-sky-950 text-sky-400 border border-sky-500/20 rounded hover:bg-sky-900/40 font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                className="px-2.5 py-1 bg-red-950/20 text-red-400 border border-red-500/20 rounded hover:bg-red-900/40 font-semibold"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {(b.status === 'approved' || b.status === 'assigned') && (
                            <button
                              onClick={() => {
                                setAssigningBooking(b);
                                setSelectedDriverId(b.assignedToAdminId || '');
                              }}
                              className="px-2.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-500/20 rounded hover:bg-indigo-900/40 font-semibold"
                            >
                              {b.status === 'assigned' ? 'Re-assign' : 'Assign Driver'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {allReports.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No tickets found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allReports.map((r) => (
                      <div key={r.id} className="p-5 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                            {r.type} #{r.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            r.status === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            r.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            r.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm font-bold text-white">{r.subject}</p>
                          <p className="text-xs text-slate-400 mt-1">{r.description}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/40 text-[11px] text-slate-400 space-y-1">
                          <p><span className="font-semibold text-slate-300">Client:</span> {r.firstName} {r.lastName} ({r.email})</p>
                          {r.bookingId && <p><span className="font-semibold text-slate-300">Linked Booking:</span> Order #{r.bookingId} ({r.bookingQuantity}L - Status: {r.bookingStatus})</p>}
                          {r.attachments && <p><span className="font-semibold text-slate-300">Attachment:</span> <a href={r.attachments} target="_blank" rel="noreferrer" className="text-sky-400 underline">{r.attachments}</a></p>}
                        </div>

                        {r.adminResponse ? (
                          <div className="p-3 bg-sky-950/20 border border-sky-500/10 rounded-lg text-xs">
                            <span className="font-semibold text-sky-300">Admin Response:</span>
                            <p className="text-slate-300 mt-1 italic">"{r.adminResponse}"</p>
                          </div>
                        ) : (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => {
                                setRespondingReport(r);
                                setAdminResponseText('');
                                setReportStatus(r.status === 'open' ? 'resolved' : r.status);
                              }}
                              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shadow transition-colors"
                            >
                              Resolve / Respond
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/20">
                        <td className="py-4 px-4 font-semibold text-white">{u.firstName} {u.lastName}</td>
                        <td className="py-4 px-4 font-mono text-slate-300">{u.email}</td>
                        <td className="py-4 px-4 text-slate-400">{u.phone || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {u.id !== currentAdmin.id && (
                            <>
                              <button
                                onClick={() => handleUserConfig(u.id, { role: u.role === 'admin' ? 'customer' : 'admin' })}
                                className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 hover:text-white"
                              >
                                Toggle Role
                              </button>
                              <button
                                onClick={() => handleUserConfig(u.id, { isActive: !u.isActive })}
                                className={`px-2.5 py-1 border rounded font-semibold ${
                                  u.isActive 
                                    ? 'bg-red-950/20 border-red-500/20 text-red-400 hover:bg-red-900/40' 
                                    : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-900/40'
                                }`}
                              >
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: Assign Driver */}
      {assigningBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl glass border border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setAssigningBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold font-display text-white mb-4">Assign Logistics Driver</h2>
            <p className="text-xs text-slate-400 mb-4">Select an Administrator/Driver to handle the delivery of {assigningBooking.quantity}L to {assigningBooking.deliveryAddress}.</p>
            
            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Select Driver</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                >
                  <option value="">-- Choose available admin/driver --</option>
                  {adminUsers.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.firstName} {driver.lastName} (@{driver.firstName.toLowerCase()})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setAssigningBooking(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs shadow"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Respond to Report */}
      {respondingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl glass border border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setRespondingReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold font-display text-white mb-2">Respond to Ticket #{respondingReport.id}</h2>
            <p className="text-xs text-slate-400 mb-4">Client Subject: <span className="font-semibold text-slate-200">"{respondingReport.subject}"</span></p>
            
            <form onSubmit={handleRespondReport} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Admin Response</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-none"
                  placeholder="Type your response to the customer..."
                  value={adminResponseText}
                  onChange={(e) => setAdminResponseText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Update Ticket Status</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors"
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                >
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setRespondingReport(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs shadow"
                >
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Update Driver Assignment */}
      {updatingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl glass border border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setUpdatingAssignment(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold font-display text-white mb-2">Update Delivery Status</h2>
            <p className="text-xs text-slate-400 mb-4">Set delivery status for Booking #{updatingAssignment.bookingId}.</p>
            
            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Delivery Status</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors"
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed (Delivered)</option>
                  <option value="failed">Failed (Delivery Failed)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Delivery Notes</label>
                <textarea 
                  rows="2"
                  className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-none"
                  placeholder="e.g. Left at doorstep, gate code failed"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setUpdatingAssignment(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs shadow"
                >
                  Update Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
