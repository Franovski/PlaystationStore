import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../features/auth/authSlice';
import { RootState, AppDispatch } from '../app/store';
import { COUNTRIES } from './AdminDashboardPage';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: '',
    dateOfBirth: '',
    role: 'playstation_user', // Default Role
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      setSuccessMsg('Account created successfully! No email OTP is required to start browsing, you can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 py-12">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create New Account</h2>
        {successMsg && (
          <div className="mb-4 text-sm text-green-500 bg-green-100 bg-opacity-10 py-3 px-4 rounded-md border border-green-500 text-center font-medium">
            {successMsg}
          </div>
        )}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Username*</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Password*</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Country*</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange as any}
                required
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">First Name (Opt)</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Last Name (Opt)</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-1">Date of Birth* (YYYY-MM-DD)</label>
              <input type="text" name="dateOfBirth" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" value={formData.dateOfBirth} onChange={handleChange} required className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
            
            {/* TEMPORARY DEV-ONLY ADMIN SIGNUP TOGGLE */}
            {import.meta.env.VITE_ENABLE_DEV_ADMIN_SIGNUP === 'true' && (
              <div className="col-span-2 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded">
                <label className="block text-yellow-500 text-xs font-bold mb-2">DEV ONLY: Account Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange as any}
                  className="w-full p-2 bg-gray-800 text-yellow-400 rounded border border-yellow-600 focus:outline-none"
                >
                  <option value="playstation_user">CUSTOMER</option>
                  <option value="admin">ADMIN</option>
                </select>
                <p className="text-xs text-yellow-600 mt-1">This exists only for testing and is removed in prod.</p>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;