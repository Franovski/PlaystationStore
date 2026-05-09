import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, requiresTwoFactor } = useAppSelector((state) => state.auth);

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
  const { isAuthenticated, user, isLoading, requiresTwoFactor } = useAppSelector((state) => state.auth);

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
