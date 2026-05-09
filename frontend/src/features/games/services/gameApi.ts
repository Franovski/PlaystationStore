import apolloClient from '../../../services/graphql';
import { GET_ALL_GAMES, GET_GAME_BY_ID, CREATE_GAME, UPDATE_GAME, DELETE_GAME } from './games.graphql';
import { Game } from '../../../types';

export const gameApi = {
  getAll: async (): Promise<Game[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ALL_GAMES,
      fetchPolicy: 'network-only'
    });
    return data.games;
  },
  getOne: async (id: number): Promise<Game> => {
    const { data } = await apolloClient.query<any>({
      query: GET_GAME_BY_ID,
      variables: { id }
    });
    return data.game;
  },
  create: async (gameData: Partial<Game>): Promise<Game> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: CREATE_GAME,
      variables: { createGameInput: gameData }
    });
    return data.createGame;
  },
  update: async (id: number, gameData: Partial<Game>): Promise<Game> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: UPDATE_GAME,
      variables: { id, updateGameInput: gameData }
    });
    return data.updateGame;
  },
  delete: async (id: number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_GAME,
      variables: { id }
    });
    return data.deleteGame;
  }
};
