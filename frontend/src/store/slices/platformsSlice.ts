import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { platformsApi } from '../../features/platforms/services/platformsApi';
import { Platform } from '../../types';

interface PlatformsState {
  items: Platform[];
  selectedPlatform: Platform | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlatformsState = {
  items: [],
  selectedPlatform: null,
  isLoading: false,
  error: null,
};

const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : 'Failed to fetch platforms';

export const fetchPlatforms = createAsyncThunk(
  'platforms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await platformsApi.getAll();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    clearPlatformsError: (state) => {
      state.error = null;
    },
    setSelectedPlatform: (state, action: { payload: Platform | null }) => {
      state.selectedPlatform = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPlatformsError, setSelectedPlatform } = platformsSlice.actions;
export default platformsSlice.reducer;
