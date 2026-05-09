import apolloClient from './apolloClient';
import {
  CREATE_REVIEW_MUTATION,
  DELETE_REVIEW_MUTATION,
  GET_REVIEWS_FOR_GAME_QUERY,
  UPDATE_REVIEW_MUTATION,
} from '../graphql/reviews';
import { Review } from '../types';

export const reviewsApi = {
  getForGame: async (gameId: number | string): Promise<Review[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_REVIEWS_FOR_GAME_QUERY,
      variables: { gameId: Number(gameId) },
      fetchPolicy: 'network-only',
    });
    return data.reviewsForGame ?? [];
  },
  create: async (payload: { gameId: number | string; rating: number; comment?: string }): Promise<Review> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: CREATE_REVIEW_MUTATION,
      variables: {
        createReviewInput: {
          gameId: Number(payload.gameId),
          rating: payload.rating,
          comment: payload.comment,
        },
      },
    });
    return data.createReview;
  },
  update: async (id: number | string, payload: { rating?: number; comment?: string }): Promise<Review> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: UPDATE_REVIEW_MUTATION,
      variables: {
        id: Number(id),
        updateReviewInput: payload,
      },
    });
    return data.updateReview;
  },
  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_REVIEW_MUTATION,
      variables: { id: Number(id) },
    });
    return data.deleteReview;
  },
};
