import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { libraryApi } from '../../features/library/services/libraryApi';
import { Game, UserLibrary } from '../../types';
import { gameDeletedSynced, gameDetailsSynced, gameSynced } from './gamesSlice';

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

const sameId = (left: number | string, right: number | string) =>
  String(left) === String(right);

const updateLibraryGame = (item: UserLibrary, game: Game) => {
  if (item.game && sameId(item.game.gameId, game.gameId)) {
    item.game = { ...item.game, ...game };
  }

  if (item.dlc?.game && sameId(item.dlc.game.gameId, game.gameId)) {
    item.dlc.game = { ...item.dlc.game, ...game };
  }

  if (item.edition?.game && sameId(item.edition.game.gameId, game.gameId)) {
    item.edition.game = { ...item.edition.game, ...game };
  }
};

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
      .addCase(gameSynced, (state, action) => {
        state.items.forEach((item) => updateLibraryGame(item, action.payload.game));
      })
      .addCase(gameDetailsSynced, (state, action) => {
        state.items.forEach((item) => updateLibraryGame(item, action.payload.game));
      })
      .addCase(gameDeletedSynced, (state, action) => {
        state.items = state.items.filter(
          (item) =>
            item.itemType !== 'game' ||
            !sameId(item.itemId, action.payload.id),
        );
      })
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
