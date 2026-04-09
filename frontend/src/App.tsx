import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AppRouter } from './routes/AppRouter';
import { socketService } from './services/socketService';

const App: React.FC = () => {
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;