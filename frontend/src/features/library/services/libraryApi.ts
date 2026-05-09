import apolloClient from '../../../services/graphql';
import { GET_USER_LIBRARY_QUERY } from './library.graphql';
import { UserLibrary } from '../../../types';

export const libraryApi = {
  getAll: async (): Promise<UserLibrary[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_USER_LIBRARY_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.userLibrary ?? [];
  },
};
