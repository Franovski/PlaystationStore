export type Role = 'admin' | 'playstation_user';

export interface User {
  userId: number;
  email: string;
  username: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  country?: string;
  dateOfBirth?: string;
  createdAt: string;
  isEmailVerified?: boolean;
  isTotpEnabled?: boolean;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  coverImage?: string;
  gallery?: string[];
  releaseDate?: string;
  rating?: number;
  developer?: string;
  publisher?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresTwoFactor: boolean;
  tempToken: string | null;
  otpMethod: 'totp' | 'email-otp' | null;
  debugOtp: string | null;
  msg: string | null;
}