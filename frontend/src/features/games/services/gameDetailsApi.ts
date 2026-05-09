import apolloClient from '../../../services/graphql';
import { GAME_CATALOG_QUERY, GAME_DETAILS_QUERY } from './gameDetails.graphql';
import { GameDetails } from '../../../types';

export const gameDetailsApi = {
  getCatalog: async (): Promise<GameDetails[]> => {
    const { data } = await apolloClient.query<any>({
      query: GAME_CATALOG_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.gameCatalog ?? [];
  },
  getDetails: async (gameId: number | string): Promise<GameDetails> => {
    const { data } = await apolloClient.query<any>({
      query: GAME_DETAILS_QUERY,
      variables: { gameId: Number(gameId) },
      fetchPolicy: 'network-only',
    });
    return data.gameDetails;
  },
};
