import { gql } from '@apollo/client';

export const WISHLIST_FIELDS = gql`
  fragment WishlistFields on Wishlist {
    wishlistId
    addedAt
    userId
    gameId
    game {
      gameId
      title
      basePrice
      developer
      publisher
      releaseDate
      ageRating
    }
  }
`;

export const GET_WISHLIST_QUERY = gql`
  ${WISHLIST_FIELDS}
  query Wishlist {
    wishlist {
      ...WishlistFields
    }
  }
`;

export const ADD_WISHLIST_ITEM_MUTATION = gql`
  ${WISHLIST_FIELDS}
  mutation AddWishlistItem($addWishlistItemInput: AddWishlistItemDto!) {
    addWishlistItem(addWishlistItemInput: $addWishlistItemInput) {
      ...WishlistFields
    }
  }
`;

export const REMOVE_WISHLIST_ITEM_MUTATION = gql`
  mutation RemoveWishlistItem($gameId: Int!) {
    removeWishlistItem(gameId: $gameId)
  }
`;
