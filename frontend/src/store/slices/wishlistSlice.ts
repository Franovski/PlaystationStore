import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { wishlistApi } from '../../features/wishlist/services/wishlistApi';
import { Wishlist } from '../../types';

interface WishlistState {
  items: Wishlist[];
  isLoading: boolean;
  actionLoading: string | null;
  error: string | null;
  successMessage: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  actionLoading: null,
  error: null,
  successMessage: null,
};

const errorMessage = (err: unknown, fallback: string) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : fallback;

export const fetchWishlist = createAsyncThunk('wishlist/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await wishlistApi.getAll();
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to fetch wishlist'));
  }
});

export const addWishlistItem = createAsyncThunk('wishlist/add', async (gameId: number | string, { rejectWithValue }) => {
  try {
    return await wishlistApi.add(gameId);
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to add wishlist item'));
  }
});

export const removeWishlistItem = createAsyncThunk('wishlist/remove', async (gameId: number | string, { rejectWithValue }) => {
  try {
    await wishlistApi.remove(gameId);
    return gameId;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to remove wishlist item'));
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addWishlistItem.pending, (state, action) => {
        state.actionLoading = `add-${action.meta.arg}`;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.items.unshift(action.payload);
        state.successMessage = 'Game added to wishlist.';
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
      })
      .addCase(removeWishlistItem.pending, (state, action) => {
        state.actionLoading = `remove-${action.meta.arg}`;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.items = state.items.filter((item) => String(item.gameId) !== String(action.payload));
        state.successMessage = 'Game removed from wishlist.';
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlistStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer;
