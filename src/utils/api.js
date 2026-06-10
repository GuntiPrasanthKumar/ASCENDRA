import axios from 'axios';

// Create axios instance with base URL for the Node.js backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookies/sessions if used
});

// Optional: Add request interceptor for tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skilltrove_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
