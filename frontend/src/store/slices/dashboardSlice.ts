import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { customerDashboardApi } from '../../features/dashboard/services/customerDashboardApi';
import { gameDetailsApi } from '../../features/games/services/gameDetailsApi';
import { ordersApi, CreateOrderPayload } from '../../features/orders/services/ordersApi';
import { reviewsApi } from '../../features/reviews/services/reviewsApi';
import { walletApi } from '../../features/wallet/services/walletApi';
import { wishlistApi } from '../../features/wishlist/services/wishlistApi';
import { CustomerDashboardData, Game, GameDetails } from '../../types';
import { gameDeletedSynced, gameDetailsSynced, gameSynced } from './gamesSlice';

interface DashboardState {
  dashboard: CustomerDashboardData | null;
  catalog: GameDetails[];
  isLoading: boolean;
  actionLoading: string | null;
  error: string | null;
  message: string | null;
}

const initialState: DashboardState = {
  dashboard: null,
  catalog: [],
  isLoading: false,
  actionLoading: null,
  error: null,
  message: null,
};

const formatPrice = (value: number | string | undefined | null) => `$${Number(value ?? 0).toFixed(2)}`;
const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : 'Request failed';

const sameId = (left: number | string, right: number | string) =>
  String(left) === String(right);

const updateNestedGame = (current: Game | null | undefined, game: Game) =>
  current && sameId(current.gameId, game.gameId)
    ? { ...current, ...game }
    : current;

const upsertCatalogDetails = (catalog: GameDetails[], details: GameDetails) => {
  const index = catalog.findIndex((item) =>
    sameId(item.game.gameId, details.game.gameId),
  );

  if (index >= 0) {
    catalog[index] = details;
  } else {
    catalog.unshift(details);
  }
};

const syncDashboardGame = (
  dashboard: CustomerDashboardData | null,
  game: Game,
) => {
  if (!dashboard) return;

  dashboard.wishlist.forEach((item) => {
    item.game = updateNestedGame(item.game, game);
  });

  dashboard.library.forEach((item) => {
    item.game = updateNestedGame(item.game, game);
    if (item.dlc?.game) {
      item.dlc.game = updateNestedGame(item.dlc.game, game);
    }
    if (item.edition?.game) {
      item.edition.game = updateNestedGame(item.edition.game, game);
    }
  });
};

const fetchDashboardPayload = async () => {
  const [dashboard, catalog] = await Promise.all([
    customerDashboardApi.get(),
    gameDetailsApi.getCatalog(),
  ]);

  return { dashboard, catalog };
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardPayload();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const purchaseDashboardItem = createAsyncThunk(
  'dashboard/purchaseItem',
  async (
    payload: {
      actionKey: string;
      paymentMethod: CreateOrderPayload['paymentMethod'];
      itemType: 'game' | 'dlc' | 'edition';
      itemId: number | string;
    },
    { rejectWithValue },
  ) => {
    try {
      const order = await ordersApi.create({
        paymentMethod: payload.paymentMethod,
        items: [{ itemType: payload.itemType, itemId: payload.itemId }],
      });
      const data = await fetchDashboardPayload();
      return {
        ...data,
        message: `Order #${order.orderId} completed for ${formatPrice(order.totalPrice)}.`,
      };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const addDashboardWishlistItem = createAsyncThunk(
  'dashboard/addWishlistItem',
  async (payload: { actionKey: string; gameId: number | string }, { rejectWithValue }) => {
    try {
      await wishlistApi.add(payload.gameId);
      const data = await fetchDashboardPayload();
      return { ...data, message: 'Game added to wishlist.' };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const removeDashboardWishlistItem = createAsyncThunk(
  'dashboard/removeWishlistItem',
  async (payload: { actionKey: string; gameId: number | string }, { rejectWithValue }) => {
    try {
      await wishlistApi.remove(payload.gameId);
      const data = await fetchDashboardPayload();
      return { ...data, message: 'Game removed from wishlist.' };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const addDashboardWalletFunds = createAsyncThunk(
  'dashboard/addWalletFunds',
  async (payload: { actionKey: string; amount: number }, { rejectWithValue }) => {
    try {
      await walletApi.addFunds(payload.amount);
      const data = await fetchDashboardPayload();
      return { ...data, message: `${formatPrice(payload.amount)} added to wallet.` };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const saveDashboardReview = createAsyncThunk(
  'dashboard/saveReview',
  async (
    payload: {
      actionKey: string;
      gameId: number | string;
      rating: number;
      comment: string;
      currentReviewId?: number | string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      if (payload.currentReviewId) {
        await reviewsApi.update(payload.currentReviewId, { rating: payload.rating, comment: payload.comment });
      } else {
        await reviewsApi.create({ gameId: payload.gameId, rating: payload.rating, comment: payload.comment });
      }
      const data = await fetchDashboardPayload();
      return { ...data, message: payload.currentReviewId ? 'Review updated.' : 'Review created.' };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const deleteDashboardReview = createAsyncThunk(
  'dashboard/deleteReview',
  async (payload: { actionKey: string; reviewId: number | string }, { rejectWithValue }) => {
    try {
      await reviewsApi.remove(payload.reviewId);
      const data = await fetchDashboardPayload();
      return { ...data, message: 'Review deleted.' };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardStatus: (state) => {
      state.error = null;
      state.message = null;
    },
    setDashboardError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.message = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(gameSynced, (state, action) => {
        const updatedGame = action.payload.game;
        state.catalog.forEach((item) => {
          if (sameId(item.game.gameId, updatedGame.gameId)) {
            item.game = { ...item.game, ...updatedGame };
          }
        });
        syncDashboardGame(state.dashboard, updatedGame);
      })
      .addCase(gameDetailsSynced, (state, action) => {
        upsertCatalogDetails(state.catalog, action.payload);
        syncDashboardGame(state.dashboard, action.payload.game);
      })
      .addCase(gameDeletedSynced, (state, action) => {
        const deletedId = action.payload.id;
        state.catalog = state.catalog.filter(
          (item) => !sameId(item.game.gameId, deletedId),
        );

        if (state.dashboard) {
          state.dashboard.wishlist = state.dashboard.wishlist.filter(
            (item) => !sameId(item.gameId, deletedId),
          );
          state.dashboard.wishlistCount = state.dashboard.wishlist.length;
          state.dashboard.library = state.dashboard.library.filter(
            (item) =>
              item.itemType !== 'game' ||
              !sameId(item.itemId, deletedId),
          );
          state.dashboard.libraryCount = state.dashboard.library.length;
        }
      })
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload.dashboard;
        state.catalog = action.payload.catalog;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addMatcher(
        isAnyOf(
          purchaseDashboardItem.pending,
          addDashboardWishlistItem.pending,
          removeDashboardWishlistItem.pending,
          addDashboardWalletFunds.pending,
          saveDashboardReview.pending,
          deleteDashboardReview.pending,
        ),
        (state, action) => {
          state.actionLoading = action.meta.arg.actionKey;
          state.error = null;
          state.message = null;
        },
      )
      .addMatcher(
        isAnyOf(
          purchaseDashboardItem.fulfilled,
          addDashboardWishlistItem.fulfilled,
          removeDashboardWishlistItem.fulfilled,
          addDashboardWalletFunds.fulfilled,
          saveDashboardReview.fulfilled,
          deleteDashboardReview.fulfilled,
        ),
        (state, action) => {
          state.actionLoading = null;
          state.dashboard = action.payload.dashboard;
          state.catalog = action.payload.catalog;
          state.message = action.payload.message;
        },
      )
      .addMatcher(
        isAnyOf(
          purchaseDashboardItem.rejected,
          addDashboardWishlistItem.rejected,
          removeDashboardWishlistItem.rejected,
          addDashboardWalletFunds.rejected,
          saveDashboardReview.rejected,
          deleteDashboardReview.rejected,
        ),
        (state, action) => {
          state.actionLoading = null;
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearDashboardStatus, setDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
