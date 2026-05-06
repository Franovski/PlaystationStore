import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      categoryId
      categoryName
    }
  }
`;

export const GET_PLATFORMS = gql`
  query GetPlatforms {
    platforms {
      platformId
      platformName
    }
  }
`;
