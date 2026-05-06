import apolloClient from './apolloClient';
import { LOGIN_MUTATION, REGISTER_MUTATION, FORGOT_PASSWORD_MUTATION, RESET_PASSWORD_MUTATION, VERIFY_TOTP_MUTATION } from '../graphql/auth';
import { User } from '../types';
import { normalizeUser, withGraphqlRole } from './graphqlMappers';

export interface LoginResponse {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  requiresTwoFactor?: boolean;
  tempToken?: string;
  otpMethod?: 'totp' | 'email-otp';
  debugOtp?: string;
}

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: LOGIN_MUTATION,
      variables: { loginInput: credentials }
    });
    return {
      ...data.login,
      user: normalizeUser(data.login?.user) ?? undefined,
    };
  },
  register: async (userData: Record<string, any>): Promise<User> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: REGISTER_MUTATION,
      variables: { registerInput: withGraphqlRole(userData) }
    });
    return normalizeUser(data.register.user) as User;
  },
  verifyTotp: async (data: { tempToken: string; code: string }): Promise<LoginResponse> => {
    const { data: res } = await apolloClient.mutate<any>({
      mutation: VERIFY_TOTP_MUTATION,
      variables: { verifyTotpInput: data }
    });
    return {
      user: normalizeUser(res.verifyTotp.user) ?? undefined,
      accessToken: res.verifyTotp.accessToken,
      refreshToken: res.verifyTotp.refreshToken,
    };
  },
  forgotPassword: async (email: string) => {
    const { data } = await apolloClient.mutate<any>({
      mutation: FORGOT_PASSWORD_MUTATION,
      variables: { forgotPasswordInput: { email } }
    });
    return data.forgotPassword;
  },
  resetPassword: async (data: Record<string, any>) => {
    const { data: res } = await apolloClient.mutate<any>({
      mutation: RESET_PASSWORD_MUTATION,
      variables: { resetPasswordInput: data }
    });
    return res.resetPassword;
  },
  logout: async () => {
    // Local logout, or server-side if token blocklist is tracked.
    return true;
  }
};
