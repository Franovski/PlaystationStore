import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

type GameChangeType = 'created' | 'updated' | 'priceUpdated' | 'statusUpdated';

// Socket.IO is attached once to Nest's underlying HTTP server on the default "/" namespace.
export const initializeSocket = (server: HttpServer): Server => {
  if (io) {
    return io;
  }

  io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL ||
        process.env.FRONTEND_URL ||
        'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    socket.on('disconnect', () => undefined);
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }

  return io;
};

export const getIo = getIO;

export const emitRealtimeEvent = (eventName: string, payload: unknown) => {
  if (!io) {
    return;
  }

  io.emit(eventName, payload);
};

export const emitClientChanged = (
  type: 'created' | 'updated',
  client: unknown,
) => {
  emitRealtimeEvent('client:changed', {
    type,
    client,
  });
};

export const emitClientDeleted = (id: string) => {
  emitRealtimeEvent('client:deleted', {
    id,
  });
};

export const emitGameChanged = (type: GameChangeType, game: unknown) => {
  emitRealtimeEvent(`game:${type}`, {
    game,
  });
};

export const emitGameDeleted = (id: number) => {
  emitRealtimeEvent('game:deleted', {
    id,
  });
};
