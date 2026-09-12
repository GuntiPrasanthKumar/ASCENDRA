import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const DEFAULT_SCHOLAR = {
  _id: 'scholar-demo-01',
  id: 'scholar-demo-01',
  name: 'Alex Mercer',
  email: 'scholar@ascendra.edu',
  role: 'Student',
  department: 'CSE',
  streak: 14,
  xp: 2850,
  level: 4,
  enrolledCourses: ['CS301', 'DS201', 'AL401'],
  badges: ['Master Learner', 'Streak Pioneer', 'Biometric Verified'],
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: DEFAULT_SCHOLAR,
      isAuthenticated: true,
      token: 'demo_scholar_token',

      login: async (credentials) => {
        try {
          const response = await api.post('/auth/login', credentials);
          const data = response.data?.data || response.data;
          const user = data.user || DEFAULT_SCHOLAR;
          const token = data.token || 'demo_scholar_token';

          if (token) {
            localStorage.setItem('skilltrove_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });
          return { success: true, user };
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
          const user = data.user || {
            ...DEFAULT_SCHOLAR,
            name: userData.name || DEFAULT_SCHOLAR.name,
            email: userData.email || DEFAULT_SCHOLAR.email,
            role: userData.role || 'Student',
          };
          const token = data.token || 'demo_scholar_token';

          if (token) {
            localStorage.setItem('skilltrove_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });
          return { success: true, user };
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
          const user = data.user || {
            ...DEFAULT_SCHOLAR,
            email,
            name: email ? email.split('@')[0] : DEFAULT_SCHOLAR.name,
          };
          const token = data.token || 'demo_scholar_token';

          if (token) {
            localStorage.setItem('skilltrove_token', token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });
          return { success: true, user };
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
          user: DEFAULT_SCHOLAR,
          token: 'demo_scholar_token',
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'skilltrove-auth',
    }
  )
);
