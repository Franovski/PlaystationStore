import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { libraryApi } from '../../features/library/services/libraryApi';
import { UserLibrary } from '../../types';

interface LibraryState {
  items: UserLibrary[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LibraryState = {
  items: [],
  isLoading: false,
  error: null,
};

const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : 'Failed to fetch library';

export const fetchLibrary = createAsyncThunk('library/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await libraryApi.getAll();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    clearLibraryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibrary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchLibrary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLibraryError } = librarySlice.actions;
export default librarySlice.reducer;
