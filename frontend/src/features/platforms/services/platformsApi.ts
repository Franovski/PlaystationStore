import apolloClient from '../../../services/graphql';
import { Platform } from '../../../types';
import { normalizePlatforms } from '../../../services/graphqlMappers';
import { GET_PLATFORMS } from './platforms.graphql';

export const platformsApi = {
  getAll: async (): Promise<Platform[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_PLATFORMS,
      fetchPolicy: 'network-only',
    });

    return normalizePlatforms(data.platforms);
  },
};
