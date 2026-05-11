import {
  createSlice,
  createAsyncThunk,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Game, GameDetails, Review } from '../../types';
import { gameApi } from '../../features/games/services/gameApi';
import { gameDetailsApi } from '../../features/games/services/gameDetailsApi';
import { ordersApi, CreateOrderPayload } from '../../features/orders/services/ordersApi';
import { reviewsApi } from '../../features/reviews/services/reviewsApi';
import { wishlistApi } from '../../features/wishlist/services/wishlistApi';

interface GamesState {
  items: Game[];
  catalogItems: GameDetails[];
  selectedGame: Game | null;
  selectedGameDetails: GameDetails | null;
  isLoading: boolean;
  detailsLoading: boolean;
  actionLoading: string | null;
  error: string | null;
  detailsError: string | null;
  actionError: string | null;
  successMessage: string | null;
}

const initialState: GamesState = {
  items: [],
  catalogItems: [],
  selectedGame: null,
  selectedGameDetails: null,
  isLoading: false,
  detailsLoading: false,
  actionLoading: null,
  error: null,
  detailsError: null,
  actionError: null,
  successMessage: null,
};

const getErrorMessage = (err: unknown, fallback: string) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : fallback;

const sameId = (left: number | string, right: number | string) =>
  String(left) === String(right);

const catalogShell = (game: Game): GameDetails => ({
  game,
  currentPrice: Number(game.basePrice ?? 0),
  activeDiscountPercentage: null,
  dlcs: [],
  editions: [],
  categories: [],
  platforms: [],
  discounts: [],
  reviews: [],
});

const syncGame = (state: GamesState, game: Game) => {
  const itemIndex = state.items.findIndex((item) =>
    sameId(item.gameId, game.gameId),
  );

  if (itemIndex >= 0) {
    state.items[itemIndex] = { ...state.items[itemIndex], ...game };
  } else {
    state.items.unshift(game);
  }

  const catalogIndex = state.catalogItems.findIndex((item) =>
    sameId(item.game.gameId, game.gameId),
  );

  if (catalogIndex >= 0) {
    const current = state.catalogItems[catalogIndex];
    const nextGame = { ...current.game, ...game };
    const discount = Number(current.activeDiscountPercentage ?? 0);
    state.catalogItems[catalogIndex] = {
      ...current,
      game: nextGame,
      currentPrice: discount
        ? Number(nextGame.basePrice) * (1 - discount / 100)
        : Number(nextGame.basePrice),
    };
  } else {
    state.catalogItems.unshift(catalogShell(game));
  }

  if (state.selectedGame && sameId(state.selectedGame.gameId, game.gameId)) {
    state.selectedGame = { ...state.selectedGame, ...game };
  }

  if (
    state.selectedGameDetails &&
    sameId(state.selectedGameDetails.game.gameId, game.gameId)
  ) {
    state.selectedGameDetails.game = {
      ...state.selectedGameDetails.game,
      ...game,
    };
  }
};

const syncGameDetails = (state: GamesState, details: GameDetails) => {
  syncGame(state, details.game);

  const catalogIndex = state.catalogItems.findIndex((item) =>
    sameId(item.game.gameId, details.game.gameId),
  );

  if (catalogIndex >= 0) {
    state.catalogItems[catalogIndex] = details;
  } else {
    state.catalogItems.unshift(details);
  }

  if (
    state.selectedGameDetails &&
    sameId(state.selectedGameDetails.game.gameId, details.game.gameId)
  ) {
    state.selectedGameDetails = details;
    state.selectedGame = details.game;
  }
};

export const fetchGames = createAsyncThunk(
  'games/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await gameApi.getAll();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch games');
    }
  }
);

export const fetchGameCatalog = createAsyncThunk(
  'games/fetchCatalog',
  async (_, { rejectWithValue }) => {
    try {
      return await gameDetailsApi.getCatalog();
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch game catalog'));
    }
  }
);

export const fetchGameDetails = createAsyncThunk(
  'games/fetchDetails',
  async (gameId: number | string, { rejectWithValue }) => {
    try {
      return await gameDetailsApi.getDetails(gameId);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch game details'));
    }
  },
);

export const syncGameDetailsFromSocket = createAsyncThunk(
  'games/syncDetailsFromSocket',
  async (gameId: number | string, { rejectWithValue }) => {
    try {
      return await gameDetailsApi.getDetails(gameId);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to sync game details'));
    }
  },
);

export const purchaseGameItem = createAsyncThunk(
  'games/purchaseItem',
  async (
    payload: {
      actionKey: string;
      paymentMethod: CreateOrderPayload['paymentMethod'];
      itemType: 'game' | 'dlc' | 'edition';
      itemId: number | string;
      gameId: number | string;
    },
    { rejectWithValue },
  ) => {
    try {
      const order = await ordersApi.create({
        paymentMethod: payload.paymentMethod,
        items: [{ itemType: payload.itemType, itemId: payload.itemId }],
      });
      const details = await gameDetailsApi.getDetails(payload.gameId);
      return { details, message: `Order #${order.orderId} completed for $${Number(order.totalPrice ?? 0).toFixed(2)}.` };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Purchase failed'));
    }
  },
);

export const addGameToWishlist = createAsyncThunk(
  'games/addToWishlist',
  async (payload: { actionKey: string; gameId: number | string }, { rejectWithValue }) => {
    try {
      await wishlistApi.add(payload.gameId);
      const details = await gameDetailsApi.getDetails(payload.gameId);
      return { details, message: 'Game added to wishlist.' };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to add game to wishlist'));
    }
  },
);

export const saveGameReview = createAsyncThunk(
  'games/saveReview',
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
      const details = await gameDetailsApi.getDetails(payload.gameId);
      return { details, message: payload.currentReviewId ? 'Review updated.' : 'Review created.' };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to save review'));
    }
  },
);

export const deleteGameReview = createAsyncThunk(
  'games/deleteReview',
  async (
    payload: { actionKey: string; gameId: number | string; review: Review },
    { rejectWithValue },
  ) => {
    try {
      await reviewsApi.remove(payload.review.reviewId);
      const details = await gameDetailsApi.getDetails(payload.gameId);
      return { details, message: 'Review deleted.' };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete review'));
    }
  },
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    clearGameDetailsStatus: (state) => {
      state.actionError = null;
      state.detailsError = null;
      state.successMessage = null;
    },
    clearSelectedGameDetails: (state) => {
      state.selectedGameDetails = null;
      state.selectedGame = null;
      state.detailsError = null;
      state.successMessage = null;
    },
    gameSynced: (state, action: PayloadAction<{ game: Game }>) => {
      if (!action.payload.game?.gameId) return;
      syncGame(state, action.payload.game);
    },
    gameDetailsSynced: (state, action: PayloadAction<GameDetails>) => {
      syncGameDetails(state, action.payload);
    },
    gameDeletedSynced: (state, action: PayloadAction<{ id: number | string }>) => {
      const deletedId = action.payload.id;
      state.items = state.items.filter((game) => !sameId(game.gameId, deletedId));
      state.catalogItems = state.catalogItems.filter(
        (item) => !sameId(item.game.gameId, deletedId),
      );

      if (state.selectedGame && sameId(state.selectedGame.gameId, deletedId)) {
        state.selectedGame = null;
        state.selectedGameDetails = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGameCatalog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameCatalog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.catalogItems = action.payload;
      })
      .addCase(fetchGameCatalog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGameDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.successMessage = null;
      })
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedGameDetails = action.payload;
        state.selectedGame = action.payload.game;
      })
      .addCase(fetchGameDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string;
      })
      .addCase(syncGameDetailsFromSocket.fulfilled, (state, action) => {
        syncGameDetails(state, action.payload);
      })
      .addMatcher(
        isAnyOf(
          purchaseGameItem.pending,
          addGameToWishlist.pending,
          saveGameReview.pending,
          deleteGameReview.pending,
        ),
        (state, action) => {
          state.actionLoading = action.meta.arg.actionKey;
          state.actionError = null;
          state.successMessage = null;
        },
      )
      .addMatcher(
        isAnyOf(
          purchaseGameItem.fulfilled,
          addGameToWishlist.fulfilled,
          saveGameReview.fulfilled,
          deleteGameReview.fulfilled,
        ),
        (state, action) => {
          state.actionLoading = null;
          state.selectedGameDetails = action.payload.details;
          state.selectedGame = action.payload.details.game;
          state.successMessage = action.payload.message;
        },
      )
      .addMatcher(
        isAnyOf(
          purchaseGameItem.rejected,
          addGameToWishlist.rejected,
          saveGameReview.rejected,
          deleteGameReview.rejected,
        ),
        (state, action) => {
          state.actionLoading = null;
          state.actionError = action.payload as string;
        },
      );
  }
});

export const {
  clearGameDetailsStatus,
  clearSelectedGameDetails,
  gameSynced,
  gameDetailsSynced,
  gameDeletedSynced,
} = gamesSlice.actions;
export default gamesSlice.reducer;
