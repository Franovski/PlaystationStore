import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../features/auth/components/ProtectedRoutes';

const HomePage = React.lazy(() => import('../pages/HomePage'));
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../features/auth/pages/RegisterPage'));
const AdminDashboardPage = React.lazy(() => import('../features/admin/pages/AdminDashboardPage'));
const UserDashboardPage = React.lazy(() => import('../features/dashboard/pages/UserDashboardPage'));
const GameDetailPage = React.lazy(() => import('../features/games/pages/GameDetailPage'));
const OtpVerificationPage = React.lazy(() => import('../features/auth/pages/OtpVerificationPage'));
const ForgotPasswordPage = React.lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../features/auth/pages/ResetPasswordPage'));
const NotAuthorizedPage = React.lazy(() => import('../features/auth/pages/NotAuthorizedPage'));

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
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
