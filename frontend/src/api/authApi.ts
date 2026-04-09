import axiosClient from './axiosClient';
import { User } from '../types';

export interface LoginResponse {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
    return axiosClient.post('/auth/login', credentials);
  },
  register: async (userData: Record<string, any>): Promise<User> => {
    return axiosClient.post('/auth/register', userData);
  },
  verifyTotp: async (data: { tempToken: string; code: string }): Promise<LoginResponse> => {
    return axiosClient.post('/auth/totp/verify', data);
  },
  forgotPassword: async (email: string) => {
    return axiosClient.post('/auth/forgot-password', { email });
  },
  resetPassword: async (data: Record<string, any>) => {
    return axiosClient.post('/auth/reset-password', data);
  },
  logout: async () => {
    return axiosClient.post('/auth/logout');
  }
};