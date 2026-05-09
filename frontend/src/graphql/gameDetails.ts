import { gql } from '@apollo/client';

export const GAME_DETAIL_FIELDS = gql`
  fragment GameDetailFields on GameDetails {
    currentPrice
    activeDiscountPercentage
    game {
      gameId
      title
      description
      releaseDate
      basePrice
      developer
      publisher
      ageRating
    }
    dlcs {
      dlcId
      name
      price
      releaseDate
      gameId
    }
    editions {
      editionId
      name
      price
      includes
      gameId
    }
    categories {
      categoryId
      categoryName
    }
    platforms {
      platformId
      platformName
    }
    discounts {
      discountId
      percentage
      startDate
      endDate
      gameId
    }
    reviews {
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
  }
`;

export const GAME_CATALOG_QUERY = gql`
  ${GAME_DETAIL_FIELDS}
  query GameCatalog {
    gameCatalog {
      ...GameDetailFields
    }
  }
`;

export const GAME_DETAILS_QUERY = gql`
  ${GAME_DETAIL_FIELDS}
  query GameDetails($gameId: Int!) {
    gameDetails(gameId: $gameId) {
      ...GameDetailFields
    }
  }
`;
