const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  register: (name, email, password) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    }),

  getMe: () => apiCall('/auth/me'),

  updateNotifications: (preferences) =>
    apiCall('/auth/notifications', {
      method: 'PUT',
      body: preferences
    })
};

// Tasks API
export const tasksAPI = {
  getAll: () => apiCall('/tasks'),

  create: (taskData) =>
    apiCall('/tasks', {
      method: 'POST',
      body: taskData
    }),

  update: (id, taskData) =>
    apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: taskData
    }),

  delete: (id) =>
    apiCall(`/tasks/${id}`, {
      method: 'DELETE'
    }),

  getAnalytics: () => apiCall('/tasks/analytics/stats')
};

// Health check
export const healthCheck = () => apiCall('/health');