import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, requiresTwoFactor } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (requiresTwoFactor) {
    return <Navigate to="/verify-otp" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, user, isLoading, requiresTwoFactor } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (requiresTwoFactor) {
    return <Navigate to="/verify-otp" replace />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== 'admin') {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};