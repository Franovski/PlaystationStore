import { gql } from '@apollo/client';
import { USER_FIELDS } from '../../auth/services/auth.graphql';

export const GET_ALL_USERS = gql`
  ${USER_FIELDS}
  query GetAllUsers {
    users {
      ...UserFields
    }
  }
`;

export const GET_USER_BY_ID = gql`
  ${USER_FIELDS}
  query GetUserById($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
`;

export const CREATE_USER = gql`
  ${USER_FIELDS}
  mutation CreateUser($createUserInput: CreateUserDto!) {
    createUser(createUserInput: $createUserInput) {
      ...UserFields
    }
  }
`;

export const UPDATE_USER = gql`
  ${USER_FIELDS}
  mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserDto!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      ...UserFields
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
