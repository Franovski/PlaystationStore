import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Game } from '../../types';
import { gameApi } from '../../api/gameApi';

interface GamesState {
  items: Game[];
  selectedGame: Game | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  items: [],
  selectedGame: null,
  isLoading: false,
  error: null,
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

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
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
      });
  }
});

export default gamesSlice.reducer;