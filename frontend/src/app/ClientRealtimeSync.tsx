import { useEffect } from 'react';
import { getSocket, SOCKET_ENABLED } from '../services/socket';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clientDeletedSynced,
  clientSynced,
  socketConnected,
  socketDisconnected,
} from '../store/slices/settingsSlice';
import {
  gameDeletedSynced,
  gameDetailsSynced,
  gameSynced,
  syncGameDetailsFromSocket,
} from '../store/slices/gamesSlice';
import { User, Game, GameDetails } from '../types';

type ClientChangedPayload =
  | {
      type?: 'created' | 'updated';
      client?: User;
    }
  | User;

type ClientDeletedPayload =
  | string
  | {
      id?: string;
      clientId?: string;
      userId?: string;
    };

type GameChangedPayload = {
  id?: number | string;
  gameId?: number | string;
  game?: Game;
  details?: GameDetails;
};

type GameDeletedPayload = {
  id: number | string;
};

const getChangedGameId = (payload: GameChangedPayload) =>
  payload.details?.game.gameId ||
  payload.game?.gameId ||
  payload.gameId ||
  payload.id;

const ClientRealtimeSync = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const socket = getSocket();

    if (!SOCKET_ENABLED || !socket) {
      dispatch(socketDisconnected());
      return;
    }

    const handleConnect = () => {
      dispatch(socketConnected());
    };

    const handleDisconnect = () => {
      dispatch(socketDisconnected());
    };

    const handleClientChanged = (payload: ClientChangedPayload) => {
      dispatch(clientSynced(payload));
    };

    const handleClientDeleted = (payload: ClientDeletedPayload) => {
      dispatch(clientDeletedSynced(payload));
    };

    const handleGameChanged = (payload: GameChangedPayload) => {
      if (payload.details) {
        dispatch(gameDetailsSynced(payload.details));
        return;
      }

      if (payload.game) {
        dispatch(gameSynced({ game: payload.game }));
      }

      const gameId = getChangedGameId(payload);
      if (gameId) {
        dispatch(syncGameDetailsFromSocket(gameId));
      }
    };

    const handleGameDeleted = (payload: GameDeletedPayload) => {
      dispatch(gameDeletedSynced(payload));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('client:changed', handleClientChanged);
    socket.on('client:deleted', handleClientDeleted);
    socket.on('game:created', handleGameChanged);
    socket.on('game:updated', handleGameChanged);
    socket.on('game:priceUpdated', handleGameChanged);
    socket.on('game:statusUpdated', handleGameChanged);
    socket.on('game:deleted', handleGameDeleted);

    if (socket.connected) {
      dispatch(socketConnected());
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('client:changed', handleClientChanged);
      socket.off('client:deleted', handleClientDeleted);
      socket.off('game:created', handleGameChanged);
      socket.off('game:updated', handleGameChanged);
      socket.off('game:priceUpdated', handleGameChanged);
      socket.off('game:statusUpdated', handleGameChanged);
      socket.off('game:deleted', handleGameDeleted);
    };
  }, [accessToken, dispatch]);

  return null;
};

export default ClientRealtimeSync;
