import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute ({ children }) {
  const { session } = useAuth();

  const location = useLocation(); 

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; 
}
export default ProtectedRoute;
