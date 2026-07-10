import axios from 'axios';

// Create axios instance with base URL for the Node.js backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 seconds threshold
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

// Add response interceptor for unified error management and token clearing on 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('skilltrove_token');
    }
    return Promise.reject(error);
  }
);

export default api;
