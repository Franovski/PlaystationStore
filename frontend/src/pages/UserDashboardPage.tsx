import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const UserDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 tracking-wider">My Store</h2>
        <button className="text-left w-full p-2 bg-blue-600 rounded">Overview</button>
        <button className="text-left w-full p-2 hover:bg-gray-700 rounded transition-colors">Library</button>
        <button className="text-left w-full p-2 hover:bg-gray-700 rounded transition-colors">Wishlist</button>
        <button className="text-left w-full p-2 hover:bg-gray-700 rounded transition-colors">Orders</button>
        <div className="mt-auto pt-8">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded transition-colors text-white font-bold">Logout</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.username}</h1>
            <p className="text-gray-400">Here's your gaming profile overview.</p>
          </div>
          <button onClick={() => navigate('/')} className="bg-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-600 transition-colors border border-gray-600">Storefront</button>
        </div>
        
        {/* Profile Card */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 max-w-2xl mb-10 border-l-4 border-l-blue-600">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Account Details</h2>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <span className="block text-gray-500 font-medium">Username</span>
              <span className="font-semibold text-lg">{user?.username}</span>
            </div>
            <div>
              <span className="block text-gray-500 font-medium">Email Address</span>
              <span className="font-semibold text-lg">{user?.email}</span>
            </div>
            <div>
              <span className="block text-gray-500 font-medium">Region</span>
              <span className="font-semibold text-lg">{user?.country}</span>
            </div>
            <div>
              <span className="block text-gray-500 font-medium">Date of Birth</span>
              <span className="font-semibold text-lg">{user?.dateOfBirth}</span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg text-center border font-bold border-gray-700 cursor-pointer hover:bg-gray-700 hover:border-blue-500 transition-all flex flex-col justify-center h-48">
             Browse Games
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center border font-bold border-gray-700 cursor-pointer hover:bg-gray-700 hover:border-blue-500 transition-all flex flex-col justify-center h-48">
             View Wishlist
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center border font-bold border-gray-700 cursor-pointer hover:bg-gray-700 hover:border-blue-500 transition-all flex flex-col justify-center h-48">
             Recent Orders
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;