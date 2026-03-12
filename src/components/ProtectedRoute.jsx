import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const ProtectedRoute = () => {
  const { session, loadingSession } = useApp();

  if (loadingSession) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return session ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
