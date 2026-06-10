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
          const { user, token } = response.data;
          
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
          return { 
            success: false, 
            message: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      signup: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data;
          
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
          return { 
            success: false, 
            message: error.response?.data?.message || 'Registration failed' 
          };
        }
      },

      faceLogin: async (email, faceDescriptor) => {
        try {
          const response = await api.post('/auth/face-login', { email, faceDescriptor });

          const { user, token } = response.data;
          
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
          return { success: false, message: 'Face recognition failed' };
        }
      },

      logout: () => {
        localStorage.removeItem('skilltrove_token');
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
