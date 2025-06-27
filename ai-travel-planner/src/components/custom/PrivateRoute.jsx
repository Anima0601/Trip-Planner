// src/components/custom/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Loading...</div>;
  }

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" replace />;
}

export default PrivateRoute;