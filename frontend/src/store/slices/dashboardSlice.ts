import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { customerDashboardApi } from '../../features/dashboard/services/customerDashboardApi';
import { gameDetailsApi } from '../../features/games/services/gameDetailsApi';
import { ordersApi, CreateOrderPayload } from '../../features/orders/services/ordersApi';
import { reviewsApi } from '../../features/reviews/services/reviewsApi';
import { walletApi } from '../../features/wallet/services/walletApi';
import { wishlistApi } from '../../features/wishlist/services/wishlistApi';
import { CustomerDashboardData, GameDetails } from '../../types';

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
