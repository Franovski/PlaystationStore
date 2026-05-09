import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
      <p className="text-gray-400 mb-6">You do not have permission to view this page.</p>
      <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-6 rounded">
        Return to Login
      </button>
    </div>
  );
};

export default NotAuthorizedPage;