import { gql } from '@apollo/client';
import apolloClient from './apolloClient';
import {
  normalizePlatform,
  normalizePlatforms,
  normalizeUser,
  normalizeUsers,
  withGraphqlPlatformName,
  withGraphqlRole,
} from './graphqlMappers';
import {
  Category,
  Game,
  GameCategory,
  GamePlatform,
  Platform,
  User,
  DLC,
  Discount,
  Edition,
  Order,
  OrderItem,
  Review,
  UserLibrary,
  UserWallet,
  Wishlist,
} from '../types';

const USER_FIELDS = gql`
  fragment AdminUserFields on User {
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
    createdAt
    updatedAt
  }
`;

const GAME_FIELDS = gql`
  fragment AdminGameFields on Game {
    gameId
    title
    description
    releaseDate
    basePrice
    developer
    publisher
    ageRating
  }
`;

const CATEGORY_FIELDS = gql`
  fragment AdminCategoryFields on Category {
    categoryId
    categoryName
  }
`;

const PLATFORM_FIELDS = gql`
  fragment AdminPlatformFields on Platform {
    platformId
    platformName
  }
`;

const DLC_FIELDS = gql`
  fragment AdminDLCFields on DLC {
    dlcId
    name
    price
    releaseDate
    gameId
  }
`;

const DLC_WITH_GAME_FIELDS = gql`
  ${GAME_FIELDS}
  ${DLC_FIELDS}
  fragment AdminDLCWithGameFields on DLC {
    ...AdminDLCFields
    game {
      ...AdminGameFields
    }
  }
`;

const ADMIN_USER_BRIEF_FIELDS = gql`
  fragment AdminUserBriefFields on User {
    userId
    username
    email
  }
`;

const DISCOUNT_FIELDS = gql`
  ${GAME_FIELDS}
  fragment AdminDiscountFields on Discount {
    discountId
    percentage
    startDate
    endDate
    gameId
    game {
      ...AdminGameFields
    }
  }
`;

const EDITION_FIELDS = gql`
  ${GAME_FIELDS}
  fragment AdminEditionFields on Edition {
    editionId
    name
    price
    includes
    gameId
    game {
      ...AdminGameFields
    }
  }
`;

const ORDER_FIELDS = gql`
  ${ADMIN_USER_BRIEF_FIELDS}
  fragment AdminOrderFields on Order {
    orderId
    orderDate
    totalPrice
    paymentMethod
    status
    userId
    user {
      ...AdminUserBriefFields
    }
    items {
      orderItemId
      itemType
      itemId
      price
      orderId
    }
  }
`;

const ORDER_ITEM_FIELDS = gql`
  ${ADMIN_USER_BRIEF_FIELDS}
  fragment AdminOrderItemFields on OrderItem {
    orderItemId
    itemType
    itemId
    price
    orderId
    order {
      orderId
      orderDate
      totalPrice
      paymentMethod
      status
      userId
      user {
        ...AdminUserBriefFields
      }
    }
  }
`;

const WALLET_FIELDS = gql`
  ${ADMIN_USER_BRIEF_FIELDS}
  fragment AdminWalletFields on UserWallet {
    walletId
    balance
    updatedAt
    userId
    user {
      ...AdminUserBriefFields
    }
  }
`;

const USER_LIBRARY_FIELDS = gql`
  ${ADMIN_USER_BRIEF_FIELDS}
  fragment AdminUserLibraryFields on UserLibrary {
    libraryId
    purchaseDate
    itemType
    itemId
    userId
    user {
      ...AdminUserBriefFields
    }
  }
`;

const WISHLIST_FIELDS = gql`
  ${ADMIN_USER_BRIEF_FIELDS}
  ${GAME_FIELDS}
  fragment AdminWishlistFields on Wishlist {
    wishlistId
    addedAt
    userId
    gameId
    user {
      ...AdminUserBriefFields
    }
    game {
      ...AdminGameFields
    }
  }
`;

const REVIEW_FIELDS = gql`
  ${ADMIN_USER_BRIEF_FIELDS}
  ${GAME_FIELDS}
  fragment AdminReviewFields on Review {
    reviewId
    rating
    comment
    createdAt
    updatedAt
    userId
    gameId
    user {
      ...AdminUserBriefFields
    }
    game {
      ...AdminGameFields
    }
  }
`;

const GAME_CATEGORY_FIELDS = gql`
  ${GAME_FIELDS}
  ${CATEGORY_FIELDS}
  fragment AdminGameCategoryFields on GameCategory {
    gameId
    categoryId
    game {
      ...AdminGameFields
    }
    category {
      ...AdminCategoryFields
    }
  }
`;

const GAME_PLATFORM_FIELDS = gql`
  ${GAME_FIELDS}
  ${PLATFORM_FIELDS}
  fragment AdminGamePlatformFields on GamePlatform {
    gameId
    platformId
    game {
      ...AdminGameFields
    }
    platform {
      ...AdminPlatformFields
    }
  }
`;

const DASHBOARD_SUMMARY = gql`
  query DashboardSummary {
    dashboardSummary {
      totalUsers
      totalAdmins
      totalCustomers
      totalGames
      totalCategories
      totalPlatforms
    }
  }
`;

const GET_USERS = gql`
  ${USER_FIELDS}
  query AdminUsers {
    users {
      ...AdminUserFields
    }
  }
`;

const GET_USER = gql`
  ${USER_FIELDS}
  query AdminUser($id: ID!) {
    user(id: $id) {
      ...AdminUserFields
    }
  }
`;

const CREATE_USER = gql`
  ${USER_FIELDS}
  mutation AdminCreateUser($createUserInput: CreateUserDto!) {
    createUser(createUserInput: $createUserInput) {
      ...AdminUserFields
    }
  }
`;

const UPDATE_USER = gql`
  ${USER_FIELDS}
  mutation AdminUpdateUser($id: ID!, $updateUserInput: UpdateUserDto!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      ...AdminUserFields
    }
  }
`;

const DELETE_USER = gql`
  mutation AdminDeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const GET_GAMES = gql`
  ${GAME_FIELDS}
  query AdminGames {
    games {
      ...AdminGameFields
    }
  }
`;

const GET_GAME = gql`
  ${GAME_FIELDS}
  query AdminGame($id: Int!) {
    game(id: $id) {
      ...AdminGameFields
    }
  }
`;

const CREATE_GAME = gql`
  ${GAME_FIELDS}
  mutation AdminCreateGame($createGameInput: CreateGameDto!) {
    createGame(createGameInput: $createGameInput) {
      ...AdminGameFields
    }
  }
`;

const UPDATE_GAME = gql`
  ${GAME_FIELDS}
  mutation AdminUpdateGame($id: Int!, $updateGameInput: UpdateGameDto!) {
    updateGame(id: $id, updateGameInput: $updateGameInput) {
      ...AdminGameFields
    }
  }
`;

const DELETE_GAME = gql`
  mutation AdminDeleteGame($id: Int!) {
    deleteGame(id: $id)
  }
`;

const GET_CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query AdminCategories {
    categories {
      ...AdminCategoryFields
    }
  }
`;

const GET_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  query AdminCategory($categoryId: Int!) {
    category(categoryId: $categoryId) {
      ...AdminCategoryFields
    }
  }
`;

const CREATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation AdminCreateCategory($createCategoryInput: CreateCategoryDto!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      ...AdminCategoryFields
    }
  }
`;

const UPDATE_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  mutation AdminUpdateCategory($categoryId: Int!, $updateCategoryInput: UpdateCategoryDto!) {
    updateCategory(categoryId: $categoryId, updateCategoryInput: $updateCategoryInput) {
      ...AdminCategoryFields
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation AdminDeleteCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId)
  }
`;

const GET_PLATFORMS = gql`
  ${PLATFORM_FIELDS}
  query AdminPlatforms {
    platforms {
      ...AdminPlatformFields
    }
  }
`;

const GET_PLATFORM = gql`
  ${PLATFORM_FIELDS}
  query AdminPlatform($platformId: Int!) {
    platform(platformId: $platformId) {
      ...AdminPlatformFields
    }
  }
`;

const CREATE_PLATFORM = gql`
  ${PLATFORM_FIELDS}
  mutation AdminCreatePlatform($createPlatformInput: CreatePlatformDto!) {
    createPlatform(createPlatformInput: $createPlatformInput) {
      ...AdminPlatformFields
    }
  }
`;

const UPDATE_PLATFORM = gql`
  ${PLATFORM_FIELDS}
  mutation AdminUpdatePlatform($platformId: Int!, $updatePlatformInput: UpdatePlatformDto!) {
    updatePlatform(platformId: $platformId, updatePlatformInput: $updatePlatformInput) {
      ...AdminPlatformFields
    }
  }
`;

const DELETE_PLATFORM = gql`
  mutation AdminDeletePlatform($platformId: Int!) {
    deletePlatform(platformId: $platformId)
  }
`;

const GET_GAME_CATEGORIES = gql`
  ${GAME_CATEGORY_FIELDS}
  query AdminGameCategories {
    gameCategories {
      ...AdminGameCategoryFields
    }
  }
`;

const GET_CATEGORIES_BY_GAME = gql`
  ${CATEGORY_FIELDS}
  query AdminCategoriesByGame($gameId: Int!) {
    gameCategoriesByGameId(gameId: $gameId) {
      ...AdminCategoryFields
    }
  }
`;

const ADD_CATEGORY_TO_GAME = gql`
  ${GAME_CATEGORY_FIELDS}
  mutation AdminAddCategoryToGame($gameId: Int!, $categoryId: Int!) {
    addCategoryToGame(gameId: $gameId, categoryId: $categoryId) {
      ...AdminGameCategoryFields
    }
  }
`;

const REMOVE_CATEGORY_FROM_GAME = gql`
  mutation AdminRemoveCategoryFromGame($gameId: Int!, $categoryId: Int!) {
    removeCategoryFromGame(gameId: $gameId, categoryId: $categoryId)
  }
`;

const GET_GAME_PLATFORMS = gql`
  ${GAME_PLATFORM_FIELDS}
  query AdminGamePlatforms {
    gamePlatforms {
      ...AdminGamePlatformFields
    }
  }
`;

const GET_PLATFORMS_BY_GAME = gql`
  ${PLATFORM_FIELDS}
  query AdminPlatformsByGame($gameId: Int!) {
    gamePlatformsByGameId(gameId: $gameId) {
      ...AdminPlatformFields
    }
  }
`;

const ADD_PLATFORM_TO_GAME = gql`
  ${GAME_PLATFORM_FIELDS}
  mutation AdminAddPlatformToGame($gameId: Int!, $platformId: Int!) {
    addPlatformToGame(gameId: $gameId, platformId: $platformId) {
      ...AdminGamePlatformFields
    }
  }
`;

const REMOVE_PLATFORM_FROM_GAME = gql`
  mutation AdminRemovePlatformFromGame($gameId: Int!, $platformId: Int!) {
    removePlatformFromGame(gameId: $gameId, platformId: $platformId)
  }
`;

const GET_DLCS = gql`
  ${DLC_WITH_GAME_FIELDS}
  query AdminDLCs {
    dlcsWithGames {
      ...AdminDLCWithGameFields
    }
  }
`;

const GET_DLC = gql`
  ${DLC_WITH_GAME_FIELDS}
  query AdminDLC($id: Int!) {
    dlcWithGame(id: $id) {
      ...AdminDLCWithGameFields
    }
  }
`;

const CREATE_DLC = gql`
  ${DLC_FIELDS}
  mutation AdminCreateDLC($createDLCInput: CreateDLCDto!) {
    createDLC(createDLCInput: $createDLCInput) {
      ...AdminDLCFields
    }
  }
`;

const UPDATE_DLC = gql`
  ${DLC_FIELDS}
  mutation AdminUpdateDLC($id: Int!, $updateDLCInput: UpdateDLCDto!) {
    updateDLC(id: $id, updateDLCInput: $updateDLCInput) {
      ...AdminDLCFields
    }
  }
`;

const DELETE_DLC = gql`
  mutation AdminDeleteDLC($id: Int!) {
    deleteDLC(id: $id)
  }
`;

const GET_DISCOUNTS = gql`
  ${DISCOUNT_FIELDS}
  query AdminDiscounts {
    discounts {
      ...AdminDiscountFields
    }
  }
`;

const CREATE_DISCOUNT = gql`
  ${DISCOUNT_FIELDS}
  mutation AdminCreateDiscount($createDiscountInput: CreateDiscountDto!) {
    createDiscount(createDiscountInput: $createDiscountInput) {
      ...AdminDiscountFields
    }
  }
`;

const UPDATE_DISCOUNT = gql`
  ${DISCOUNT_FIELDS}
  mutation AdminUpdateDiscount($id: Int!, $updateDiscountInput: UpdateDiscountDto!) {
    updateDiscount(id: $id, updateDiscountInput: $updateDiscountInput) {
      ...AdminDiscountFields
    }
  }
`;

const DELETE_DISCOUNT = gql`
  mutation AdminDeleteDiscount($id: Int!) {
    deleteDiscount(id: $id)
  }
`;

const GET_EDITIONS = gql`
  ${EDITION_FIELDS}
  query AdminEditions {
    editions {
      ...AdminEditionFields
    }
  }
`;

const CREATE_EDITION = gql`
  ${EDITION_FIELDS}
  mutation AdminCreateEdition($createEditionInput: CreateEditionDto!) {
    createEdition(createEditionInput: $createEditionInput) {
      ...AdminEditionFields
    }
  }
`;

const UPDATE_EDITION = gql`
  ${EDITION_FIELDS}
  mutation AdminUpdateEdition($id: Int!, $updateEditionInput: UpdateEditionDto!) {
    updateEdition(id: $id, updateEditionInput: $updateEditionInput) {
      ...AdminEditionFields
    }
  }
`;

const DELETE_EDITION = gql`
  mutation AdminDeleteEdition($id: Int!) {
    deleteEdition(id: $id)
  }
`;

const GET_ADMIN_ORDERS = gql`
  ${ORDER_FIELDS}
  query AdminOrders {
    adminOrders {
      ...AdminOrderFields
    }
  }
`;

const GET_ADMIN_ORDER_ITEMS = gql`
  ${ORDER_ITEM_FIELDS}
  query AdminOrderItems {
    adminOrderItems {
      ...AdminOrderItemFields
    }
  }
`;

const GET_ADMIN_WALLETS = gql`
  ${WALLET_FIELDS}
  query AdminWallets {
    adminWallets {
      ...AdminWalletFields
    }
  }
`;

const GET_ADMIN_USER_LIBRARY = gql`
  ${USER_LIBRARY_FIELDS}
  query AdminUserLibrary {
    adminUserLibrary {
      ...AdminUserLibraryFields
    }
  }
`;

const GET_ADMIN_WISHLISTS = gql`
  ${WISHLIST_FIELDS}
  query AdminWishlists {
    adminWishlists {
      ...AdminWishlistFields
    }
  }
`;

const GET_ADMIN_REVIEWS = gql`
  ${REVIEW_FIELDS}
  query AdminReviews {
    adminReviews {
      ...AdminReviewFields
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation AdminDeleteReview($id: Int!) {
    deleteReview(id: $id)
  }
`;

const toInt = (value: string | number) => Number(value);

const categoryInput = (data: Record<string, any>) => ({
  categoryName: data.categoryName,
});

const discountInput = (data: Record<string, any>) => ({
  percentage: Number(data.percentage),
  startDate: data.startDate,
  endDate: data.endDate,
  gameId: toInt(data.gameId),
});

const editionInput = (data: Record<string, any>) => ({
  name: data.name,
  price: Number(data.price),
  includes: data.includes || undefined,
  gameId: toInt(data.gameId),
});

const normalizeGamePlatform = (relation: any): GamePlatform => ({
  ...relation,
  platform: normalizePlatform(relation.platform) ?? undefined,
});

export const adminSummaryApi = {
  getSummary: async () => {
    const { data } = await apolloClient.query<any>({
      query: DASHBOARD_SUMMARY,
      fetchPolicy: 'network-only',
    });

    return data.dashboardSummary;
  },
};

export const adminUsersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_USERS,
      fetchPolicy: 'network-only',
    });

    return normalizeUsers(data.users);
  },

  getById: async (id: number | string): Promise<User | null> => {
    const { data } = await apolloClient.query<any>({
      query: GET_USER,
      variables: { id: String(id) },
      fetchPolicy: 'network-only',
    });

    return normalizeUser(data.user);
  },

  create: async (data: Record<string, any>): Promise<User | null> => {
    const result = await apolloClient.mutate<any>({
      mutation: CREATE_USER,
      variables: { createUserInput: withGraphqlRole(data) },
    });

    return normalizeUser(result.data?.createUser);
  },

  update: async (id: number | string, data: Record<string, any>): Promise<User | null> => {
    const result = await apolloClient.mutate<any>({
      mutation: UPDATE_USER,
      variables: { id: String(id), updateUserInput: withGraphqlRole(data) },
    });

    return normalizeUser(result.data?.updateUser);
  },

  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_USER,
      variables: { id: String(id) },
    });

    return data.deleteUser;
  },
};

export const adminGamesApi = {
  getAll: async (): Promise<Game[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_GAMES,
      fetchPolicy: 'network-only',
    });

    return data.games ?? [];
  },

  getById: async (id: number | string): Promise<Game> => {
    const { data } = await apolloClient.query<any>({
      query: GET_GAME,
      variables: { id: toInt(id) },
      fetchPolicy: 'network-only',
    });

    return data.game;
  },

  create: async (data: Record<string, any>): Promise<Game> => {
    const result = await apolloClient.mutate<any>({
      mutation: CREATE_GAME,
      variables: { createGameInput: data },
    });

    return result.data.createGame;
  },

  update: async (id: number | string, data: Record<string, any>): Promise<Game> => {
    const result = await apolloClient.mutate<any>({
      mutation: UPDATE_GAME,
      variables: { id: toInt(id), updateGameInput: data },
    });

    return result.data.updateGame;
  },

  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_GAME,
      variables: { id: toInt(id) },
    });

    return data.deleteGame;
  },
};

export const adminPlatformsApi = {
  getAll: async (): Promise<Platform[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_PLATFORMS,
      fetchPolicy: 'network-only',
    });

    return normalizePlatforms(data.platforms);
  },

  getById: async (id: string | number): Promise<Platform | null> => {
    const { data } = await apolloClient.query<any>({
      query: GET_PLATFORM,
      variables: { platformId: toInt(id) },
      fetchPolicy: 'network-only',
    });

    return normalizePlatform(data.platform);
  },

  create: async (data: Record<string, any>): Promise<Platform | null> => {
    const result = await apolloClient.mutate<any>({
      mutation: CREATE_PLATFORM,
      variables: { createPlatformInput: withGraphqlPlatformName(data) },
    });

    return normalizePlatform(result.data?.createPlatform);
  },

  update: async (id: string | number, data: Record<string, any>): Promise<Platform | null> => {
    const result = await apolloClient.mutate<any>({
      mutation: UPDATE_PLATFORM,
      variables: {
        platformId: toInt(id),
        updatePlatformInput: withGraphqlPlatformName(data),
      },
    });

    return normalizePlatform(result.data?.updatePlatform);
  },

  remove: async (id: string | number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_PLATFORM,
      variables: { platformId: toInt(id) },
    });

    return data.deletePlatform;
  },
};

export const adminCategoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_CATEGORIES,
      fetchPolicy: 'network-only',
    });

    return data.categories ?? [];
  },

  getById: async (id: string | number): Promise<Category> => {
    const { data } = await apolloClient.query<any>({
      query: GET_CATEGORY,
      variables: { categoryId: toInt(id) },
      fetchPolicy: 'network-only',
    });

    return data.category;
  },

  create: async (data: Record<string, any>): Promise<Category> => {
    const result = await apolloClient.mutate<any>({
      mutation: CREATE_CATEGORY,
      variables: { createCategoryInput: categoryInput(data) },
    });

    return result.data.createCategory;
  },

  update: async (id: string | number, data: Record<string, any>): Promise<Category> => {
    const result = await apolloClient.mutate<any>({
      mutation: UPDATE_CATEGORY,
      variables: {
        categoryId: toInt(id),
        updateCategoryInput: categoryInput(data),
      },
    });

    return result.data.updateCategory;
  },

  remove: async (id: string | number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_CATEGORY,
      variables: { categoryId: toInt(id) },
    });

    return data.deleteCategory;
  },
};

export const adminGameCategoriesApi = {
  getAll: async (): Promise<GameCategory[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_GAME_CATEGORIES,
      fetchPolicy: 'network-only',
    });

    return data.gameCategories ?? [];
  },

  getByGame: async (gameId: string | number): Promise<Category[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_CATEGORIES_BY_GAME,
      variables: { gameId: toInt(gameId) },
      fetchPolicy: 'network-only',
    });

    return data.gameCategoriesByGameId ?? [];
  },

  create: async (data: {
    gameId: string | number;
    categoryId: string | number;
  }): Promise<GameCategory> => {
    const result = await apolloClient.mutate<any>({
      mutation: ADD_CATEGORY_TO_GAME,
      variables: {
        gameId: toInt(data.gameId),
        categoryId: toInt(data.categoryId),
      },
    });

    return result.data.addCategoryToGame;
  },

  update: async (
    gameId: string | number,
    categoryId: string | number,
    data: { newCategoryId: string | number },
  ): Promise<GameCategory> => {
    await adminGameCategoriesApi.remove(gameId, categoryId);
    return adminGameCategoriesApi.create({
      gameId,
      categoryId: data.newCategoryId,
    });
  },

  remove: async (
    gameId: string | number,
    categoryId: string | number,
  ): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: REMOVE_CATEGORY_FROM_GAME,
      variables: {
        gameId: toInt(gameId),
        categoryId: toInt(categoryId),
      },
    });

    return data.removeCategoryFromGame;
  },
};

export const adminGamePlatformsApi = {
  getAll: async (): Promise<GamePlatform[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_GAME_PLATFORMS,
      fetchPolicy: 'network-only',
    });

    return (data.gamePlatforms ?? []).map(normalizeGamePlatform);
  },

  getByGame: async (gameId: string | number): Promise<Platform[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_PLATFORMS_BY_GAME,
      variables: { gameId: toInt(gameId) },
      fetchPolicy: 'network-only',
    });

    return normalizePlatforms(data.gamePlatformsByGameId);
  },

  create: async (data: {
    gameId: string | number;
    platformId: string | number;
  }): Promise<GamePlatform> => {
    const result = await apolloClient.mutate<any>({
      mutation: ADD_PLATFORM_TO_GAME,
      variables: {
        gameId: toInt(data.gameId),
        platformId: toInt(data.platformId),
      },
    });

    return normalizeGamePlatform(result.data.addPlatformToGame);
  },

  update: async (
    gameId: string | number,
    platformId: string | number,
    data: { newPlatformId: string | number },
  ): Promise<GamePlatform> => {
    await adminGamePlatformsApi.remove(gameId, platformId);
    return adminGamePlatformsApi.create({
      gameId,
      platformId: data.newPlatformId,
    });
  },

  remove: async (
    gameId: string | number,
    platformId: string | number,
  ): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: REMOVE_PLATFORM_FROM_GAME,
      variables: {
        gameId: toInt(gameId),
        platformId: toInt(platformId),
      },
    });

    return data.removePlatformFromGame;
  },
};

export const adminDlcApi = {
  getAll: async (): Promise<DLC[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_DLCS,
      fetchPolicy: 'network-only',
    });

    return data.dlcsWithGames ?? [];
  },

  getById: async (id: number | string): Promise<DLC> => {
    const { data } = await apolloClient.query<any>({
      query: GET_DLC,
      variables: { id: toInt(id) },
      fetchPolicy: 'network-only',
    });

    return data.dlcWithGame;
  },

  create: async (data: Record<string, any>): Promise<DLC> => {
    const payload = {
      name: data.name,
      price: Number(data.price),
      releaseDate: data.releaseDate || undefined,
      gameId: toInt(data.gameId),
    };

    const result = await apolloClient.mutate<any>({
      mutation: CREATE_DLC,
      variables: {
        createDLCInput: payload,
      },
    });

    return result.data.createDLC;
  },

  update: async (id: number | string, data: Record<string, any>): Promise<DLC> => {
    const payload: Record<string, any> = {};

    if (data.name !== undefined) {
      payload.name = data.name;
    }

    if (data.price !== undefined) {
      payload.price = Number(data.price);
    }

    if (data.releaseDate !== undefined) {
      payload.releaseDate = data.releaseDate || undefined;
    }

    if (data.gameId !== undefined) {
      payload.gameId = toInt(data.gameId);
    }

    const result = await apolloClient.mutate<any>({
      mutation: UPDATE_DLC,
      variables: {
        id: toInt(id),
        updateDLCInput: payload,
      },
    });

    return result.data.updateDLC;
  },

  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_DLC,
      variables: {
        id: toInt(id),
      },
    });

    return data.deleteDLC;
  },
};

export const adminDiscountsApi = {
  getAll: async (): Promise<Discount[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_DISCOUNTS,
      fetchPolicy: 'network-only',
    });

    return data.discounts ?? [];
  },

  create: async (data: Record<string, any>): Promise<Discount> => {
    const result = await apolloClient.mutate<any>({
      mutation: CREATE_DISCOUNT,
      variables: { createDiscountInput: discountInput(data) },
    });

    return result.data.createDiscount;
  },

  update: async (id: number | string, data: Record<string, any>): Promise<Discount> => {
    const result = await apolloClient.mutate<any>({
      mutation: UPDATE_DISCOUNT,
      variables: { id: toInt(id), updateDiscountInput: discountInput(data) },
    });

    return result.data.updateDiscount;
  },

  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_DISCOUNT,
      variables: { id: toInt(id) },
    });

    return data.deleteDiscount;
  },
};

export const adminEditionsApi = {
  getAll: async (): Promise<Edition[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_EDITIONS,
      fetchPolicy: 'network-only',
    });

    return data.editions ?? [];
  },

  create: async (data: Record<string, any>): Promise<Edition> => {
    const result = await apolloClient.mutate<any>({
      mutation: CREATE_EDITION,
      variables: { createEditionInput: editionInput(data) },
    });

    return result.data.createEdition;
  },

  update: async (id: number | string, data: Record<string, any>): Promise<Edition> => {
    const result = await apolloClient.mutate<any>({
      mutation: UPDATE_EDITION,
      variables: { id: toInt(id), updateEditionInput: editionInput(data) },
    });

    return result.data.updateEdition;
  },

  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_EDITION,
      variables: { id: toInt(id) },
    });

    return data.deleteEdition;
  },
};

export const adminOrdersApi = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ADMIN_ORDERS,
      fetchPolicy: 'network-only',
    });

    return data.adminOrders ?? [];
  },
};

export const adminOrderItemsApi = {
  getAll: async (): Promise<OrderItem[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ADMIN_ORDER_ITEMS,
      fetchPolicy: 'network-only',
    });

    return data.adminOrderItems ?? [];
  },
};

export const adminWalletsApi = {
  getAll: async (): Promise<UserWallet[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ADMIN_WALLETS,
      fetchPolicy: 'network-only',
    });

    return data.adminWallets ?? [];
  },
};

export const adminUserLibraryApi = {
  getAll: async (): Promise<UserLibrary[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ADMIN_USER_LIBRARY,
      fetchPolicy: 'network-only',
    });

    return data.adminUserLibrary ?? [];
  },
};

export const adminWishlistsApi = {
  getAll: async (): Promise<Wishlist[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ADMIN_WISHLISTS,
      fetchPolicy: 'network-only',
    });

    return data.adminWishlists ?? [];
  },
};

export const adminReviewsApi = {
  getAll: async (): Promise<Review[]> => {
    const { data } = await apolloClient.query<any>({
      query: GET_ADMIN_REVIEWS,
      fetchPolicy: 'network-only',
    });

    return data.adminReviews ?? [];
  },

  remove: async (id: number | string): Promise<boolean> => {
    const { data } = await apolloClient.mutate<any>({
      mutation: DELETE_REVIEW,
      variables: { id: toInt(id) },
    });

    return data.deleteReview;
  },
};
