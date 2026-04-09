import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [stats, setStats] = useState({ users: 0, games: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const users = await axiosClient.get('/users');
        const games = await axiosClient.get('/games');
        setStats({ users: users.data?.length || 0, games: games.data?.length || 0 });
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 tracking-wider">Admin Panel</h2>
        <button className="text-left w-full p-2 bg-blue-600 rounded">Dashboard</button>
        <button className="text-left w-full p-2 hover:bg-gray-700 rounded transition-colors">Users</button>
        <button className="text-left w-full p-2 hover:bg-gray-700 rounded transition-colors">Games</button>
        <div className="mt-auto pt-8">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded transition-colors text-white font-bold">Logout</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
            <p className="text-gray-400">Here's what's happening with your store today.</p>
          </div>
        </div>
        
        {/* Stats */}
        {isLoading ? (
          <div>Loading stats...</div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Users</h3>
              <p className="text-4xl font-bold">{stats.users}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Games</h3>
              <p className="text-4xl font-bold">{stats.games}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;