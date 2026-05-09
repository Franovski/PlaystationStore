import { gql } from '@apollo/client';

export const USER_LIBRARY_FIELDS = gql`
  fragment UserLibraryFields on UserLibrary {
    libraryId
    purchaseDate
    itemType
    itemId
    userId
  }
`;

export const GET_USER_LIBRARY_QUERY = gql`
  ${USER_LIBRARY_FIELDS}
  query UserLibrary {
    userLibrary {
      ...UserLibraryFields
    }
  }
`;
