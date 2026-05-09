import { gql } from '@apollo/client';

export const GET_ALL_GAMES = gql`
  query GetAllGames($title: String) {
    games(title: $title) {
      gameId
      title
      description
      releaseDate
      basePrice
      developer
      publisher
      ageRating
    }
  }
`;

export const GET_GAME_BY_ID = gql`
  query GetGameById($id: Int!) {
    game(id: $id) {
      gameId
      title
      description
      releaseDate
      basePrice
      developer
      publisher
      ageRating
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameDto!) {
    createGame(createGameInput: $createGameInput) {
      gameId
      title
      basePrice
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($id: Int!, $updateGameInput: UpdateGameDto!) {
    updateGame(id: $id, updateGameInput: $updateGameInput) {
      gameId
      title
      basePrice
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($id: Int!) {
    deleteGame(id: $id)
  }
`;
