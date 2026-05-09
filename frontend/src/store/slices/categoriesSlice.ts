import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { categoriesApi } from '../../features/categories/services/categoriesApi';
import { Category } from '../../types';

interface CategoriesState {
  items: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : 'Failed to fetch categories';

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await categoriesApi.getAll();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesError: (state) => {
      state.error = null;
    },
    setSelectedCategory: (state, action: { payload: Category | null }) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoriesError, setSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
