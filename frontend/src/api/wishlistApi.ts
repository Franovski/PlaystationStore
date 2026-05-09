import apolloClient from './apolloClient';
import {
  ADD_WISHLIST_ITEM_MUTATION,
  GET_WISHLIST_QUERY,
  REMOVE_WISHLIST_ITEM_MUTATION,
} from '../graphql/wishlist';
import { Wishlist } from '../types';

export const wishlistApi = {
  getAll: async (): Promise<Wishlist[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_WISHLIST_QUERY,
      fetchPolicy: 'network-only',
    });
    return data.wishlist ?? [];
  },
  add: async (gameId: number | string): Promise<Wishlist> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: ADD_WISHLIST_ITEM_MUTATION,
      variables: { addWishlistItemInput: { gameId: Number(gameId) } },
    });
    return data.addWishlistItem;
  },
  remove: async (gameId: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: REMOVE_WISHLIST_ITEM_MUTATION,
      variables: { gameId: Number(gameId) },
    });
    return data.removeWishlistItem;
  },
};
