const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('campusconnect_token');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email, password, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });
    return response.json();
  },

  register: async (email, password, name, role, college) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, role, college }),
    });
    return response.json();
  },

  logout: async () => {
    return makeAuthenticatedRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return makeAuthenticatedRequest('/auth/me');
  },
};

// Users API
export const usersAPI = {
  getMentors: async (college, search) => {
    const params = new URLSearchParams();
    if (college) params.append('college', college);
    if (search) params.append('search', search);
    
    return makeAuthenticatedRequest(`/users/mentors?${params.toString()}`);
  },

  getOnlineMentors: async (college) => {
    const params = new URLSearchParams();
    if (college) params.append('college', college);
    
    return makeAuthenticatedRequest(`/users/mentors/online?${params.toString()}`);
  },

  updateProfile: async (updates) => {
    return makeAuthenticatedRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  toggleAvailability: async () => {
    return makeAuthenticatedRequest('/users/availability', {
      method: 'PATCH',
    });
  },
};

// Sessions API
export const sessionsAPI = {
  createSession: async (mentorId, topic, sessionType, scheduledTime) => {
    return makeAuthenticatedRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify({ mentorId, topic, sessionType, scheduledTime }),
    });
  },

  getSessions: async (status, type) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    
    return makeAuthenticatedRequest(`/sessions?${params.toString()}`);
  },

  updateSessionStatus: async (sessionId, status) => {
    return makeAuthenticatedRequest(`/sessions/${sessionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  completeSession: async (sessionId, rating, feedback) => {
    return makeAuthenticatedRequest(`/sessions/${sessionId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ rating, feedback }),
    });
  },

  sendMessage: async (sessionId, message, messageType = 'text') => {
    return makeAuthenticatedRequest(`/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, messageType }),
    });
  },
};

// Payments API
export const paymentsAPI = {
  createOrder: async (sessionId) => {
    return makeAuthenticatedRequest('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },

  verifyPayment: async (paymentData) => {
    return makeAuthenticatedRequest('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};