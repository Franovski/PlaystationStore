import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { dlcApi } from '../../features/dlc/services/dlcApi';
import { DLC } from '../../types';

interface DlcState {
  items: DLC[];
  selectedDlc: DLC | null;
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: DlcState = {
  items: [],
  selectedDlc: null,
  isLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

const errorMessage = (err: unknown, fallback: string) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : fallback;

export const fetchDlcs = createAsyncThunk('dlc/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await dlcApi.getAllWithGames();
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to fetch DLC'));
  }
});

export const createDlc = createAsyncThunk('dlc/create', async (payload: Partial<DLC>, { rejectWithValue }) => {
  try {
    return await dlcApi.create(payload);
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to create DLC'));
  }
});

export const updateDlc = createAsyncThunk(
  'dlc/update',
  async (payload: { id: number | string; data: Partial<DLC> }, { rejectWithValue }) => {
    try {
      return await dlcApi.update(payload.id, payload.data);
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to update DLC'));
    }
  },
);

export const deleteDlc = createAsyncThunk('dlc/delete', async (id: number | string, { rejectWithValue }) => {
  try {
    await dlcApi.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to delete DLC'));
  }
});

const dlcSlice = createSlice({
  name: 'dlc',
  initialState,
  reducers: {
    clearDlcStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSelectedDlc: (state, action: { payload: DLC | null }) => {
      state.selectedDlc = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDlcs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDlcs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchDlcs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addMatcher(
        isAnyOf(createDlc.pending, updateDlc.pending, deleteDlc.pending),
        (state) => {
          state.actionLoading = true;
          state.error = null;
          state.successMessage = null;
        },
      )
      .addMatcher(
        isAnyOf(createDlc.fulfilled, updateDlc.fulfilled, deleteDlc.fulfilled),
        (state, action) => {
          state.actionLoading = false;
          if (action.type === createDlc.fulfilled.type) {
            state.items.unshift(action.payload as DLC);
            state.successMessage = 'DLC created.';
          } else if (action.type === updateDlc.fulfilled.type) {
            const updated = action.payload as DLC;
            state.items = state.items.map((item) => (item.dlcId === updated.dlcId ? updated : item));
            state.successMessage = 'DLC updated.';
          } else {
            state.items = state.items.filter((item) => String(item.dlcId) !== String(action.payload));
            state.successMessage = 'DLC deleted.';
          }
        },
      )
      .addMatcher(
        isAnyOf(createDlc.rejected, updateDlc.rejected, deleteDlc.rejected),
        (state, action) => {
          state.actionLoading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearDlcStatus, setSelectedDlc } = dlcSlice.actions;
export default dlcSlice.reducer;


/*
  step 3
 */
