import { io, Socket } from 'socket.io-client';
import { tokenService } from './tokenService';

// Keep sockets on the backend origin only; paths become namespaces in Socket.IO.
const getSocketOrigin = (url?: string) => {
  if (!url) {
    return '';
  }

  try {
    return new URL(url.trim()).origin;
  } catch {
    return '';
  }
};

const socketUrl = getSocketOrigin(import.meta.env.VITE_SOCKET_URL);

export const SOCKET_ENABLED = Boolean(socketUrl);

let socket: Socket | null = null;

// Returns the one shared Socket.IO client used by the realtime sync component.
export const getSocket = () => {
  if (!SOCKET_ENABLED) {
    return null;
  }

  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: false,
      auth: {
        token: tokenService.getToken(),
      },
    });

    if (import.meta.env.DEV) {
      socket.on('connect_error', (error) => {
        console.error(`Socket connection error: ${error.message}`);
      });
    }
  }

  socket.auth = {
    token: tokenService.getToken(),
  };

  return socket;
};
