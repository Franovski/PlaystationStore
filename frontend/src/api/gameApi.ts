import axiosClient from './axiosClient';
import { Game } from '../types';

export const gameApi = {
  getAll: async (): Promise<Game[]> => {
    return axiosClient.get('/games');
  },
  getOne: async (id: number): Promise<Game> => {
    return axiosClient.get(`/games/${id}`);
  },
  create: async (data: Partial<Game>): Promise<Game> => {
    return axiosClient.post('/games', data);
  },
};