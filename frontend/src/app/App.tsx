import React from 'react';
import ClientRealtimeSync from './ClientRealtimeSync';
import { AppRoutes } from './routes';

const App: React.FC = () => {
  return (
    <>
      <ClientRealtimeSync />
      <AppRoutes />
    </>
  );
};

export default App;
