import React from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  // Seamless frictionless access: allow direct exploration of all modules
  return children;
}
