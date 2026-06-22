async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('binuthman_token') || sessionStorage.getItem('binuthman_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: (email, password) => 
      apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
    
    register: (userData) => 
      apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    
    verifyEmail: (token) => 
      apiRequest(`/api/auth/verify-email?token=${token}`),
    
    requestPasswordReset: (email) => 
      apiRequest('/api/auth/request-password-reset', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    
    resetPassword: (token, newPassword) => 
      apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      })
  },

  // Users
  users: {
    getProfile: () => apiRequest('/api/users/profile'),
    
    updateProfile: (profileData) => 
      apiRequest('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData)
      }),
    
    listAll: () => apiRequest('/api/users'),
    
    updateStatus: (userId, settings) => 
      apiRequest(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(settings)
      })
  },

  // Bookings
  bookings: {
    create: (bookingData) => 
      apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      }),
    
    list: () => apiRequest('/api/bookings'),
    
    get: (id) => apiRequest(`/api/bookings/${id}`),
    
    updateStatus: (id, status) => 
      apiRequest(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    
    assign: (id, assignedToAdminId) => 
      apiRequest(`/api/bookings/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ assignedToAdminId })
      })
  },

  // Assignments
  assignments: {
    list: () => apiRequest('/api/assignments'),
    
    updateStatus: (assignmentId, status, deliveryNotes) => 
      apiRequest(`/api/assignments/${assignmentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, deliveryNotes })
      })
  },

  // Reports/Feedback
  reports: {
    create: (reportData) => 
      apiRequest('/api/reports', {
        method: 'POST',
        body: JSON.stringify(reportData)
      }),
    
    list: () => apiRequest('/api/reports'),
    
    respond: (reportId, responseText, status) => 
      apiRequest(`/api/reports/${reportId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ adminResponse: responseText, status })
      })
  }
};
