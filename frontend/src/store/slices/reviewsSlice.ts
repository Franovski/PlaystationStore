import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { reviewsApi } from '../../features/reviews/services/reviewsApi';
import { Review } from '../../types';

interface ReviewsState {
  items: Review[];
  selectedReview: Review | null;
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ReviewsState = {
  items: [],
  selectedReview: null,
  isLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

const errorMessage = (err: unknown, fallback: string) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : fallback;

export const fetchReviewsForGame = createAsyncThunk(
  'reviews/fetchForGame',
  async (gameId: number | string, { rejectWithValue }) => {
    try {
      return await reviewsApi.getForGame(gameId);
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to fetch reviews'));
    }
  },
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async (payload: { gameId: number | string; rating: number; comment?: string }, { rejectWithValue }) => {
    try {
      return await reviewsApi.create(payload);
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to create review'));
    }
  },
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async (payload: { id: number | string; data: { rating?: number; comment?: string } }, { rejectWithValue }) => {
    try {
      return await reviewsApi.update(payload.id, payload.data);
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to update review'));
    }
  },
);

export const deleteReview = createAsyncThunk('reviews/delete', async (id: number | string, { rejectWithValue }) => {
  try {
    await reviewsApi.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to delete review'));
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewsStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedReview: (state, action: { payload: Review | null }) => {
      state.selectedReview = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsForGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsForGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviewsForGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addMatcher(
        isAnyOf(createReview.pending, updateReview.pending, deleteReview.pending),
        (state) => {
          state.actionLoading = true;
          state.error = null;
          state.successMessage = null;
        },
      )
      .addMatcher(
        isAnyOf(createReview.fulfilled, updateReview.fulfilled, deleteReview.fulfilled),
        (state, action) => {
          state.actionLoading = false;
          if (action.type === createReview.fulfilled.type) {
            state.items.unshift(action.payload as Review);
            state.successMessage = 'Review created.';
          } else if (action.type === updateReview.fulfilled.type) {
            const updated = action.payload as Review;
            state.items = state.items.map((item) => (item.reviewId === updated.reviewId ? updated : item));
            state.successMessage = 'Review updated.';
          } else {
            state.items = state.items.filter((item) => String(item.reviewId) !== String(action.payload));
            state.successMessage = 'Review deleted.';
          }
        },
      )
      .addMatcher(
        isAnyOf(createReview.rejected, updateReview.rejected, deleteReview.rejected),
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearReviewsStatus, setSelectedReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
