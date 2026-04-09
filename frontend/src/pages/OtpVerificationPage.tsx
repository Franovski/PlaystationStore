import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyTotp, clearError } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';

const OtpVerificationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, requiresTwoFactor, tempToken, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (!requiresTwoFactor || !tempToken) {
      navigate('/login');
    }
  }, [dispatch, requiresTwoFactor, tempToken, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/user');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempToken) return;
    await dispatch(verifyTotp({ tempToken, code }));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 py-12">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Two-Factor Authentication</h2>
        <p className="text-gray-300 text-sm text-center mb-6">Open your authenticator app and enter the 6-digit code.</p>
        
        {error && (
          <div className="mb-4 text-sm text-red-500 bg-red-100 bg-opacity-10 py-2 px-3 rounded border border-red-500">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Passcode</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="123456"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !code}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;