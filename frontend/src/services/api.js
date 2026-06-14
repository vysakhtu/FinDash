import axios from 'axios';

// Use environment variable VITE_API_URL, fallback to local Django server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the Authorization Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 Unauthorized (invalid/deleted token) and reset session
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      // Reload to reset the AuthContext states and bounce back to login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const transactionService = {
  /**
   * User Registration
   */
  register: async (username, email, password) => {
    try {
      const response = await apiClient.post('auth/register/', { username, email, password });
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * User Login (DRF Obtain Auth Token)
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post('auth/login/', { username, password });
      return response.data; // Returns { token: '...' }
    } catch (error) {
      console.error('Login API error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * User Logout
   */
  logout: async () => {
    try {
      const response = await apiClient.post('auth/logout/');
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch transactions list with optional filters
   * @param {Object} filters - Optional filters: category, start_date, end_date
   */
  getTransactions: async (filters = {}) => {
    try {
      const params = {};
      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }
      if (filters.startDate) {
        params.start_date = filters.startDate;
      }
      if (filters.endDate) {
        params.end_date = filters.endDate;
      }

      const response = await apiClient.get('transactions/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction details (amount, category, type, date, note)
   */
  createTransaction: async (transactionData) => {
    try {
      const response = await apiClient.post('transactions/', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch dashboard summary cards data and chart aggregates
   */
  getSummary: async () => {
    try {
      const response = await apiClient.get('summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw handleApiError(error);
    }
  },
};

// Standardized error-handling extractor
function handleApiError(error) {
  if (error.response) {
    const data = error.response.data;
    if (typeof data === 'object') {
      const messages = Object.entries(data).map(([field, msg]) => {
        const messageText = Array.isArray(msg) ? msg[0] : msg;
        return `${field}: ${messageText}`;
      });
      return new Error(messages.join(' | '));
    }
    return new Error(error.response.statusText || 'Server error occurred.');
  } else if (error.request) {
    return new Error('No response received from server. Check if the backend is running.');
  } else {
    return new Error(error.message || 'API request failed.');
  }
}
