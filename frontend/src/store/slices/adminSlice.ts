import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  adminCategoriesApi,
  adminDlcApi,
  adminDiscountsApi,
  adminEditionsApi,
  adminGameCategoriesApi,
  adminGamePlatformsApi,
  adminGamesApi,
  adminOrderItemsApi,
  adminOrdersApi,
  adminPlatformsApi,
  adminReviewsApi,
  adminSummaryApi,
  adminUserLibraryApi,
  adminUsersApi,
  adminWalletsApi,
  adminWishlistsApi,
} from '../../features/admin/services/adminApi';
import {
  Category,
  DLC,
  Discount,
  Edition,
  Game,
  GameCategory,
  GamePlatform,
  Order,
  OrderItem,
  Platform,
  Review,
  User,
  UserLibrary,
  UserWallet,
  Wishlist,
} from '../../types';
import { gameDeletedSynced, gameDetailsSynced, gameSynced } from './gamesSlice';

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'games'
  | 'platforms'
  | 'categories'
  | 'gameCategories'
  | 'gamePlatforms'
  | 'dlcs'
  | 'orders'
  | 'orderItems'
  | 'wallets'
  | 'libraries'
  | 'wishlists'
  | 'reviews'
  | 'discounts'
  | 'editions';

interface AdminStats {
  users: number;
  admins: number;
  customers: number;
  games: number;
  categories: number;
  platforms: number;
}

interface AdminState {
  stats: AdminStats;
  usersList: User[];
  gamesList: Game[];
  platformsList: Platform[];
  categoriesList: Category[];
  gameCategoriesList: GameCategory[];
  gamePlatformsList: GamePlatform[];
  dlcsList: DLC[];
  ordersList: Order[];
  orderItemsList: OrderItem[];
  walletsList: UserWallet[];
  librariesList: UserLibrary[];
  wishlistsList: Wishlist[];
  reviewsList: Review[];
  discountsList: Discount[];
  editionsList: Edition[];
  isLoading: boolean;
  adminError: string | null;
  adminSuccess: string | null;
}

const emptyStats: AdminStats = {
  users: 0,
  admins: 0,
  customers: 0,
  games: 0,
  categories: 0,
  platforms: 0,
};

const initialState: AdminState = {
  stats: emptyStats,
  usersList: [],
  gamesList: [],
  platformsList: [],
  categoriesList: [],
  gameCategoriesList: [],
  gamePlatformsList: [],
  dlcsList: [],
  ordersList: [],
  orderItemsList: [],
  walletsList: [],
  librariesList: [],
  wishlistsList: [],
  reviewsList: [],
  discountsList: [],
  editionsList: [],
  isLoading: false,
  adminError: null,
  adminSuccess: null,
};

const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : 'Request failed';

const asArray = <T>(value: T[] | null | undefined): T[] => (Array.isArray(value) ? value : []);
const sameId = (left: number | string, right: number | string) =>
  String(left) === String(right);

const syncNestedGame = <T extends { game?: Game | null }>(
  item: T,
  game: Game,
) => {
  if (item.game && sameId(item.game.gameId, game.gameId)) {
    item.game = { ...item.game, ...game };
  }
};

const syncAdminGame = (state: AdminState, game: Game) => {
  const gameIndex = state.gamesList.findIndex((item) =>
    sameId(item.gameId, game.gameId),
  );

  if (gameIndex >= 0) {
    state.gamesList[gameIndex] = { ...state.gamesList[gameIndex], ...game };
  } else {
    state.gamesList.unshift(game);
    state.stats.games += 1;
  }

  state.dlcsList.forEach((item) => syncNestedGame(item, game));
  state.discountsList.forEach((item) => syncNestedGame(item, game));
  state.editionsList.forEach((item) => syncNestedGame(item, game));
  state.wishlistsList.forEach((item) => syncNestedGame(item, game));
  state.librariesList.forEach((item) => {
    syncNestedGame(item, game);
    if (item.dlc?.game && sameId(item.dlc.game.gameId, game.gameId)) {
      item.dlc.game = { ...item.dlc.game, ...game };
    }
    if (item.edition?.game && sameId(item.edition.game.gameId, game.gameId)) {
      item.edition.game = { ...item.edition.game, ...game };
    }
  });
  state.orderItemsList.forEach((item) => {
    syncNestedGame(item, game);
    if (item.dlc?.game && sameId(item.dlc.game.gameId, game.gameId)) {
      item.dlc.game = { ...item.dlc.game, ...game };
    }
    if (item.edition?.game && sameId(item.edition.game.gameId, game.gameId)) {
      item.edition.game = { ...item.edition.game, ...game };
    }
  });
  state.ordersList.forEach((order) => {
    order.items?.forEach((item) => {
      syncNestedGame(item, game);
      if (item.dlc?.game && sameId(item.dlc.game.gameId, game.gameId)) {
        item.dlc.game = { ...item.dlc.game, ...game };
      }
      if (item.edition?.game && sameId(item.edition.game.gameId, game.gameId)) {
        item.edition.game = { ...item.edition.game, ...game };
      }
    });
  });
};

const removeAdminGame = (state: AdminState, id: number | string) => {
  const hadGame = state.gamesList.some((game) => sameId(game.gameId, id));
  state.gamesList = state.gamesList.filter((game) => !sameId(game.gameId, id));
  if (hadGame) {
    state.stats.games = Math.max(0, state.stats.games - 1);
  }

  state.dlcsList = state.dlcsList.filter((item) => !sameId(item.gameId, id));
  state.discountsList = state.discountsList.filter((item) => !sameId(item.gameId, id));
  state.editionsList = state.editionsList.filter((item) => !sameId(item.gameId, id));
  state.gameCategoriesList = state.gameCategoriesList.filter((item) => !sameId(item.gameId, id));
  state.gamePlatformsList = state.gamePlatformsList.filter((item) => !sameId(item.gameId, id));
  state.wishlistsList = state.wishlistsList.filter((item) => !sameId(item.gameId, id));
  state.librariesList = state.librariesList.filter(
    (item) => item.itemType !== 'game' || !sameId(item.itemId, id),
  );
};

export const loadAdminTabData = createAsyncThunk(
  'admin/loadTabData',
  async (activeTab: AdminTab, { rejectWithValue }) => {
    try {
      if (activeTab === 'dashboard') {
        const summary: any = await adminSummaryApi.getSummary();
        return {
          activeTab,
          stats: {
            users: summary?.totalUsers || 0,
            admins: summary?.totalAdmins || 0,
            customers: summary?.totalCustomers || 0,
            games: summary?.totalGames || 0,
            categories: summary?.totalCategories || 0,
            platforms: summary?.totalPlatforms || 0,
          },
        };
      }

      if (activeTab === 'users') return { activeTab, usersList: asArray(await adminUsersApi.getAll()) };
      if (activeTab === 'games') return { activeTab, gamesList: asArray(await adminGamesApi.getAll()) };
      if (activeTab === 'platforms') return { activeTab, platformsList: asArray(await adminPlatformsApi.getAll()) };
      if (activeTab === 'categories') return { activeTab, categoriesList: asArray(await adminCategoriesApi.getAll()) };

      if (activeTab === 'gameCategories') {
        const [gamesList, categoriesList, gameCategoriesList] = await Promise.all([
          adminGamesApi.getAll(),
          adminCategoriesApi.getAll(),
          adminGameCategoriesApi.getAll().catch((): GameCategory[] => []),
        ]);
        return {
          activeTab,
          gamesList: asArray(gamesList),
          categoriesList: asArray(categoriesList),
          gameCategoriesList: asArray(gameCategoriesList),
        };
      }

      if (activeTab === 'gamePlatforms') {
        const [gamesList, platformsList, gamePlatformsList] = await Promise.all([
          adminGamesApi.getAll(),
          adminPlatformsApi.getAll(),
          adminGamePlatformsApi.getAll().catch((): GamePlatform[] => []),
        ]);
        return {
          activeTab,
          gamesList: asArray(gamesList),
          platformsList: asArray(platformsList),
          gamePlatformsList: asArray(gamePlatformsList),
        };
      }

      if (activeTab === 'dlcs') {
        const [gamesList, dlcsList] = await Promise.all([
          adminGamesApi.getAll(),
          adminDlcApi.getAll(),
        ]);
        return { activeTab, gamesList: asArray(gamesList), dlcsList: asArray(dlcsList) };
      }

      if (activeTab === 'orders') return { activeTab, ordersList: asArray(await adminOrdersApi.getAll()) };
      if (activeTab === 'orderItems') return { activeTab, orderItemsList: asArray(await adminOrderItemsApi.getAll()) };
      if (activeTab === 'wallets') return { activeTab, walletsList: asArray(await adminWalletsApi.getAll()) };
      if (activeTab === 'libraries') return { activeTab, librariesList: asArray(await adminUserLibraryApi.getAll()) };
      if (activeTab === 'wishlists') return { activeTab, wishlistsList: asArray(await adminWishlistsApi.getAll()) };
      if (activeTab === 'reviews') return { activeTab, reviewsList: asArray(await adminReviewsApi.getAll()) };

      if (activeTab === 'discounts') {
        const [gamesList, discountsList] = await Promise.all([
          adminGamesApi.getAll(),
          adminDiscountsApi.getAll(),
        ]);
        return { activeTab, gamesList: asArray(gamesList), discountsList: asArray(discountsList) };
      }

      const [gamesList, editionsList] = await Promise.all([
        adminGamesApi.getAll(),
        adminEditionsApi.getAll(),
      ]);
      return { activeTab, gamesList: asArray(gamesList), editionsList: asArray(editionsList) };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminStatus: (state) => {
      state.adminError = null;
      state.adminSuccess = null;
    },
    setAdminError: (state, action: PayloadAction<string | null>) => {
      state.adminError = action.payload;
      if (action.payload) {
        state.adminSuccess = null;
      }
    },
    setAdminSuccess: (state, action: PayloadAction<string | null>) => {
      state.adminSuccess = action.payload;
      if (action.payload) {
        state.adminError = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminTabData.pending, (state) => {
        state.isLoading = true;
        state.adminError = null;
      })
      .addCase(loadAdminTabData.fulfilled, (state, action) => {
        state.isLoading = false;
        Object.assign(state, action.payload);
      })
      .addCase(loadAdminTabData.rejected, (state, action) => {
        state.isLoading = false;
        state.adminError = action.payload as string;
      })
      .addCase(gameSynced, (state, action) => {
        syncAdminGame(state, action.payload.game);
      })
      .addCase(gameDetailsSynced, (state, action) => {
        syncAdminGame(state, action.payload.game);
      })
      .addCase(gameDeletedSynced, (state, action) => {
        removeAdminGame(state, action.payload.id);
      });
  },
});

export const { clearAdminStatus, setAdminError, setAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;
