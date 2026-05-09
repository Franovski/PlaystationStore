import { gql } from '@apollo/client';

export const GET_ALL_DLCS = gql`
  query GetAllDLCs($name: String, $gameId: Int) {
    dlcs(name: $name, gameId: $gameId) {
      dlcId
      name
      price
      releaseDate
      gameId
    }
  }
`;

export const GET_ALL_DLCS_WITH_GAMES = gql`
  query GetAllDLCsWithGames {
    dlcsWithGames {
      dlcId
      name
      price
      releaseDate
      gameId
      game {
        gameId
        title
        basePrice
      }
    }
  }
`;

export const GET_DLC_BY_ID = gql`
  query GetDLCById($id: Int!) {
    dlc(id: $id) {
      dlcId
      name
      price
      releaseDate
      gameId
    }
  }
`;

export const CREATE_DLC = gql`
  mutation CreateDLC($createDLCInput: CreateDLCDto!) {
    createDLC(createDLCInput: $createDLCInput) {
      dlcId
      name
      price
      releaseDate
      gameId
    }
  }
`;

export const UPDATE_DLC = gql`
  mutation UpdateDLC($id: Int!, $updateDLCInput: UpdateDLCDto!) {
    updateDLC(id: $id, updateDLCInput: $updateDLCInput) {
      dlcId
      name
      price
      releaseDate
      gameId
    }
  }
`;

export const DELETE_DLC = gql`
  mutation DeleteDLC($id: Int!) {
    deleteDLC(id: $id)
  }
`;