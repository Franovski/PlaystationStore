import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    userId
    username
    email
    firstName
    lastName
    country
    dateOfBirth
    role
    isEmailVerified
    isTotpEnabled
  }
`;

export const LOGIN_MUTATION = gql`
  ${USER_FIELDS}
  mutation Login($loginInput: LoginDto!) {
    login(loginInput: $loginInput) {
      accessToken
      refreshToken
      requiresTwoFactor
      tempToken
      otpMethod
      user {
        ...UserFields
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  ${USER_FIELDS}
  mutation Register($registerInput: RegisterDto!) {
    register(registerInput: $registerInput) {
      accessToken
      refreshToken
      user {
        ...UserFields
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($forgotPasswordInput: ForgotPasswordDto!) {
    forgotPassword(forgotPasswordInput: $forgotPasswordInput)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($resetPasswordInput: ResetPasswordDto!) {
    resetPassword(resetPasswordInput: $resetPasswordInput)
  }
`;

export const VERIFY_TOTP_MUTATION = gql`
  ${USER_FIELDS}
  mutation VerifyTotp($verifyTotpInput: VerifyTotpDto!) {
    verifyTotp(verifyTotpInput: $verifyTotpInput) {
      accessToken
      refreshToken
      user {
        ...UserFields
      }
    }
  }
`;
