import apolloClient from './apolloClient';
import { GET_USER_LIBRARY_QUERY } from '../graphql/library';
import { UserLibrary } from '../types';

export const libraryApi = {
  getAll: async (): Promise<UserLibrary[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_USER_LIBRARY_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.userLibrary ?? [];
  },
};
