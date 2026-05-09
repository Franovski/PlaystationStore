import { gql } from '@apollo/client';

export const REVIEW_FIELDS = gql`
  fragment ReviewFields on Review {
    reviewId
    rating
    comment
    createdAt
    updatedAt
    userId
    gameId
    user {
      userId
      username
    }
  }
`;

export const GET_REVIEWS_FOR_GAME_QUERY = gql`
  ${REVIEW_FIELDS}
  query ReviewsForGame($gameId: Int!) {
    reviewsForGame(gameId: $gameId) {
      ...ReviewFields
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  ${REVIEW_FIELDS}
  mutation CreateReview($createReviewInput: CreateReviewDto!) {
    createReview(createReviewInput: $createReviewInput) {
      ...ReviewFields
    }
  }
`;

export const UPDATE_REVIEW_MUTATION = gql`
  ${REVIEW_FIELDS}
  mutation UpdateReview($id: Int!, $updateReviewInput: UpdateReviewDto!) {
    updateReview(id: $id, updateReviewInput: $updateReviewInput) {
      ...ReviewFields
    }
  }
`;

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($id: Int!) {
    deleteReview(id: $id)
  }
`;
