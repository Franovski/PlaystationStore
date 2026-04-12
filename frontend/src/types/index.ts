export type Role = 'admin' | 'playstation_user';

export interface User {
  userId: string;
  email: string;
  username: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  country?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt?: string;
  isEmailVerified?: boolean;
  isTotpEnabled?: boolean;
}

export interface Game {
  gameId: number | string;
  title: string;
  description?: string;
  releaseDate?: string;
  basePrice: number;
  developer?: string;
  publisher?: string;
  ageRating?: string;
}

export interface Platform {
  platformId: string | number;
  platformName: 'ps4' | 'ps5';
}

export interface Category {
  categoryId: string | number;
  categoryName: string;
  description?: string;
}

export interface GameCategory {
  gameId: string | number;
  categoryId: string | number;
  game?: Game;
  category?: Category;
}

export interface GamePlatform {
  gameId: string | number;
  platformId: string | number;
  game?: Game;
  platform?: Platform;
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
  msg: string | null;
}