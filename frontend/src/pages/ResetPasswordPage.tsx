import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordThunk, clearError } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, msg } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (!token) {
      // Typically we'll redirect if there's no token, but allowing error msg to show is better UX
    }
  }, [dispatch, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match"); return;
    }
    const result = await dispatch(resetPasswordThunk({ token, newPassword }));
    if (result.meta.requestStatus === 'fulfilled') {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 py-12">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create New Password</h2>
        
        {msg && (
          <div className="mb-4 text-sm text-green-500 bg-green-100 bg-opacity-10 py-3 px-4 rounded border border-green-500 text-center font-medium">
            {msg} Redirecting to login...
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100 bg-opacity-10 py-2 px-3 rounded border border-red-500 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">New Password (Min 8 chars)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required minLength={8}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required minLength={8}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword || !token}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Confirm Reset'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;