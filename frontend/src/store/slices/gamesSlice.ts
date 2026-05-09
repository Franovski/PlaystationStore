import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { Game, GameDetails, Review } from '../../types';
import { gameApi } from '../../features/games/services/gameApi';
import { gameDetailsApi } from '../../features/games/services/gameDetailsApi';
import { ordersApi, CreateOrderPayload } from '../../features/orders/services/ordersApi';
import { reviewsApi } from '../../features/reviews/services/reviewsApi';
import { wishlistApi } from '../../features/wishlist/services/wishlistApi';

interface GamesState {
  items: Game[];
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

export const { clearGameDetailsStatus, clearSelectedGameDetails } = gamesSlice.actions;
export default gamesSlice.reducer;
