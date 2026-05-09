import apolloClient from './apolloClient';
import {
  GET_ALL_DLCS,
  GET_ALL_DLCS_WITH_GAMES,
  GET_DLC_BY_ID,
  CREATE_DLC,
  UPDATE_DLC,
  DELETE_DLC,
} from '../graphql/dlc';
import { DLC } from '../types';

const toInt = (value: number | string): number => Number(value);

export const dlcApi = {
  getAll: async (filters?: {
    name?: string;
    gameId?: number | string;
  }): Promise<DLC[]> => {
    const { data } = await apolloClient.query({
      query: GET_ALL_DLCS,
      variables: {
        name: filters?.name,
        gameId: filters?.gameId !== undefined ? toInt(filters.gameId) : undefined,
      },
      fetchPolicy: 'network-only',
    });

    return data.dlcs ?? [];
  },

  getAllWithGames: async (): Promise<DLC[]> => {
    const { data } = await apolloClient.query({
      query: GET_ALL_DLCS_WITH_GAMES,
      fetchPolicy: 'network-only',
    });

    return data.dlcsWithGames ?? [];
  },

  getOne: async (id: number | string): Promise<DLC> => {
    const { data } = await apolloClient.query({
      query: GET_DLC_BY_ID,
      variables: {
        id: toInt(id),
      },
      fetchPolicy: 'network-only',
    });

    return data.dlc;
  },

  create: async (dlcData: Partial<DLC>): Promise<DLC> => {
    const payload = {
      name: dlcData.name,
      price: Number(dlcData.price),
      releaseDate: dlcData.releaseDate || undefined,
      gameId: toInt(dlcData.gameId as number | string),
    };

    const { data } = await apolloClient.mutate({
      mutation: CREATE_DLC,
      variables: {
        createDLCInput: payload,
      },
    });

    return data.createDLC;
  },

  update: async (id: number | string, dlcData: Partial<DLC>): Promise<DLC> => {
    const payload: Record<string, unknown> = {};

    if (dlcData.name !== undefined) {
      payload.name = dlcData.name;
    }

    if (dlcData.price !== undefined) {
      payload.price = Number(dlcData.price);
    }

    if (dlcData.releaseDate !== undefined) {
      payload.releaseDate = dlcData.releaseDate || undefined;
    }

    if (dlcData.gameId !== undefined) {
      payload.gameId = toInt(dlcData.gameId);
    }

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_DLC,
      variables: {
        id: toInt(id),
        updateDLCInput: payload,
      },
    });

    return data.updateDLC;
  },

  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_DLC,
      variables: {
        id: toInt(id),
      },
    });

    return data.deleteDLC;
  },
};