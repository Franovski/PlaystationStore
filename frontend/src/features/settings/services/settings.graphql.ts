import { gql } from '@apollo/client';

export const SETTINGS_USER_FIELDS = gql`
  fragment SettingsUserFields on User {
    userId
    username
    email
    firstName
    lastName
    role
    isEmailVerified
    isTotpEnabled
    createdAt
    password
    totpSecret
    refreshToken
    passwordResetToken
    passwordResetExpires
    passwordResetMethod
    passwordResetAttempts
  }
`;

export const GET_ADMIN_USERS = gql`
  ${SETTINGS_USER_FIELDS}
  query GetAdminUsers {
    adminUsers {
      ...SettingsUserFields
    }
  }
`;

export const UPDATE_USER_SETTINGS = gql`
  ${SETTINGS_USER_FIELDS}
  mutation UpdateUserSettings($id: ID!, $updateUserSettingsInput: UpdateUserSettingsDto!) {
    updateUserSettings(id: $id, updateUserSettingsInput: $updateUserSettingsInput) {
      ...SettingsUserFields
    }
  }
`;
