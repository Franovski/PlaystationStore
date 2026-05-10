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
  password?: string | null;
  totpSecret?: string | null;
  refreshToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  passwordResetMethod?: string | null;
  passwordResetAttempts?: number;
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

export interface DLC {
  dlcId: number | string;
  name: string;
  price: number;
  releaseDate?: string;
  gameId: number | string;
  game?: Game | null;
}

export interface Edition {
  editionId: number | string;
  name: string;
  price: number;
  includes?: string | null;
  gameId: number | string;
  game?: Game | null;
}

export interface Discount {
  discountId: number | string;
  percentage: number;
  startDate: string;
  endDate: string;
  gameId: number | string;
  game?: Game | null;
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

export interface Wishlist {
  wishlistId: number | string;
  addedAt: string;
  userId: string;
  gameId: number | string;
  user?: User | null;
  game?: Game | null;
}

export interface UserLibrary {
  libraryId: number | string;
  purchaseDate: string;
  itemType: 'game' | 'dlc' | 'edition' | string;
  itemId: number | string;
  userId: string;
  user?: User | null;
  game?: Game | null;
  dlc?: DLC | null;
  edition?: Edition | null;
}

export interface Review {
  reviewId: number | string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt?: string;
  userId: string;
  gameId: number | string;
  user?: User | null;
  game?: Game | null;
}

export interface OrderItem {
  orderItemId: number | string;
  itemType: 'game' | 'dlc' | 'edition' | string;
  itemId: number | string;
  price: number;
  orderId: number | string;
  order?: Order | null;
  game?: Game | null;
  dlc?: DLC | null;
  edition?: Edition | null;
}

export interface Order {
  orderId: number | string;
  orderDate: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  userId: string;
  user?: User | null;
  items?: OrderItem[] | null;
}

export interface UserWallet {
  walletId: number | string;
  balance: number;
  updatedAt: string;
  userId: string;
  user?: User | null;
}

export interface GameDetails {
  game: Game;
  currentPrice: number;
  activeDiscountPercentage?: number | null;
  dlcs: DLC[];
  editions: Edition[];
  categories: Category[];
  platforms: Platform[];
  discounts: Discount[];
  reviews: Review[];
}

export interface CustomerDashboardData {
  wallet: UserWallet;
  walletBalance: number;
  wishlist: Wishlist[];
  library: UserLibrary[];
  orders: Order[];
  wishlistCount: number;
  libraryCount: number;
  orderCount: number;
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

