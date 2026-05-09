import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const NavBar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-black/95 sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-white font-bold text-xl tracking-tight cursor-pointer">
            <span className="text-blue-500">PS</span> Store
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-white text-gray-300 transition-colors">Store</Link>
            <a href="#" className="hover:text-white text-gray-300 transition-colors">Collections</a>
            <a href="#" className="hover:text-white text-gray-300 transition-colors">Deals</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white mr-4">Search</button>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Hi, {user?.username}</span>
              {user?.role === 'admin' ? (
                <button onClick={() => navigate('/admin')} className="text-white bg-blue-600 px-4 py-1.5 rounded text-sm hover:bg-blue-700">Admin</button>
              ) : (
                <button onClick={() => navigate('/user')} className="text-white bg-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-600">Dashboard</button>
              )}
              <button onClick={handleLogout} className="text-white bg-red-600 px-4 py-1.5 rounded text-sm hover:bg-red-700">Logout</button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-black bg-white px-4 py-1.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
