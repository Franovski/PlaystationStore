import apolloClient from '../../../services/graphql';
import { Category } from '../../../types';
import { GET_CATEGORIES } from './categories.graphql';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_CATEGORIES,
      fetchPolicy: 'network-only',
    });

    return data.categories ?? [];
  },
};
