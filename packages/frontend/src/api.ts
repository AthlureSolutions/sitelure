// packages/frontend/src/api.ts

import axios from 'axios';

// Create a custom event for token expiration
export const tokenExpiredEvent = new CustomEvent('tokenExpired', {
  detail: { message: 'Your session has expired. Please log in again.' }
});

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // Dispatch token expired event
      window.dispatchEvent(tokenExpiredEvent);
    }
    return Promise.reject(error);
  }
);

export default api;
