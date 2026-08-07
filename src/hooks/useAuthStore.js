import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (credentials) => {
        try {
          const response = await api.post('/auth/login', credentials);
          const data = response.data?.data || response.data;
          const user = data.user;
          const token = data.token;

          if (token) {
            localStorage.setItem('skilltrove_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          const msg = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      error.message || 
                      'Login failed';
          return { success: false, message: msg };
        }
      },

      signup: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          const data = response.data?.data || response.data;
          const user = data.user;
          const token = data.token;

          if (token) {
            localStorage.setItem('skilltrove_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          console.error('Signup error:', error);
          const msg = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      error.message || 
                      'Registration failed';
          return { success: false, message: msg };
        }
      },

      faceLogin: async (email, faceDescriptor) => {
        try {
          const response = await api.post('/auth/face-login', { email, faceDescriptor });
          const data = response.data?.data || response.data;
          const user = data.user;
          const token = data.token;

          if (token) {
            localStorage.setItem('skilltrove_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });
          return { success: true };
        } catch (error) {
          console.error('Face Login error:', error);
          const msg = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      error.message || 
                      'Face recognition failed';
          return { success: false, message: msg };
        }
      },

      logout: () => {
        localStorage.removeItem('skilltrove_token');
        localStorage.removeItem('token');
        localStorage.removeItem('skilltrove-auth');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'skilltrove-auth',
    }
  )
);
