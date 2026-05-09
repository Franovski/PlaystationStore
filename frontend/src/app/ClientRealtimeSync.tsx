import { useEffect } from 'react';
import { socketService } from '../services/socket';

const ClientRealtimeSync = () => {
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return null;
};

export default ClientRealtimeSync;
