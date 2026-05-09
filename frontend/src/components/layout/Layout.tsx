import React from 'react';
import NavBar from './NavBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans">
      <NavBar />
      <main className="container mx-auto pb-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;
