import { io, Socket } from 'socket.io-client';
import { tokenService } from './tokenService';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const token = tokenService.getToken();
    
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();