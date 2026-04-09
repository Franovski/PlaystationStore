import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user, requiresTwoFactor } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (requiresTwoFactor) {
      navigate('/verify-otp');
    } else if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/user');
    }
  }, [requiresTwoFactor, isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Sign In</h2>
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100 bg-opacity-10 py-2 px-3 rounded border border-red-500">
            {error.includes('|') ? (
              <ul className="list-disc pl-4 space-y-1">
                {error.split(' | ').map((msg: string, i: number) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            ) : (
              <p>{error}</p>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 flex flex-col space-y-2 text-center text-sm">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-blue-400 hover:underline">
              Create one
            </button>
          </p>
          <p className="text-gray-400">
            <button onClick={() => navigate('/forgot-password')} className="text-gray-300 hover:text-white hover:underline transition-colors mt-2">
              Forgot your password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;