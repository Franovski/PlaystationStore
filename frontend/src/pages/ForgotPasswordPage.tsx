import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordThunk, clearError } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, msg } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(forgotPasswordThunk(email));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 py-12">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Reset Password</h2>
        <p className="text-gray-300 text-sm text-center mb-6">Enter your registered email address, and we'll send you a link to choose a new password.</p>
        
        {msg && (
          <div className="mb-4 text-sm text-green-500 bg-green-100 bg-opacity-10 py-3 px-4 rounded border border-green-500 text-center font-medium">
            {msg}
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100 bg-opacity-10 py-2 px-3 rounded border border-red-500 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Remembered your password?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;