import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './ProtectedRoutes';

const HomePage = React.lazy(() => import('../pages/HomePage'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const AdminDashboardPage = React.lazy(() => import('../pages/AdminDashboardPage'));
const UserDashboardPage = React.lazy(() => import('../pages/UserDashboardPage'));
const OtpVerificationPage = React.lazy(() => import('../pages/OtpVerificationPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../pages/ResetPasswordPage'));
const NotAuthorizedPage = React.lazy(() => import('../pages/NotAuthorizedPage'));

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />

          <Route element={<ProtectedRoute />}>
             <Route path="/user" element={<UserDashboardPage />} />
          </Route>

          <Route element={<AdminRoute />}>
             <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};