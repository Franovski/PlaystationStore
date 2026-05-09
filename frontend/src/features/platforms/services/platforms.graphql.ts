import { gql } from '@apollo/client';

export const GET_PLATFORMS = gql`
  query GetPlatforms {
    platforms {
      platformId
      platformName
    }
  }
`;
