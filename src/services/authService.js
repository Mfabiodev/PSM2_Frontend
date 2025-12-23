import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'; // Use environment variable or default

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API response:', response);
    return response;
  },
  (error) => {
    console.error('API error response:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('auth_token');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(email, password) {
    try {
      console.log('Attempting login with email:', email);
      const response = await api.post('/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log('Token stored in localStorage');
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      throw error.response?.data || error;
    }
  },

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await api.post('/logout');
        console.log('User logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, remove the token
    } finally {
      // Remove token from localStorage regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Get user info error:', error);
      throw error.response?.data || error;
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.post('/user/update-profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error.response?.data || error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Get token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/refresh');
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error.response?.data || error;
    }
  }
};