import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  settingsApi,
  UpdateUserSettingsPayload,
} from '../../features/settings/services/settingsApi';
import { User } from '../../types';

interface SettingsState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isUpdating: boolean;
  updatingUserId: string | null;
  error: string | null;
  successMessage: string | null;
}

const initialState: SettingsState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  isUpdating: false,
  updatingUserId: null,
  error: null,
  successMessage: null,
};

const getErrorMessage = (err: unknown, fallback: string) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : fallback;

export const fetchAdminUsers = createAsyncThunk(
  'settings/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await settingsApi.fetchAdminUsers();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch users'));
    }
  },
);

export const updateUserSettings = createAsyncThunk(
  'settings/updateUserSettings',
  async (
    payload: { userId: string; changes: UpdateUserSettingsPayload },
    { rejectWithValue },
  ) => {
    try {
      const user = await settingsApi.updateUserSettings(payload.userId, payload.changes);
      if (!user) {
        throw new Error('User update returned no data');
      }

      return user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to update user settings'));
    }
  },
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearSettingsStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setSettingsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.successMessage = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserSettings.pending, (state, action) => {
        state.isUpdating = true;
        state.updatingUserId = action.meta.arg.userId;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updatingUserId = null;
        state.users = state.users.map((user) =>
          user.userId === action.payload.userId ? action.payload : user,
        );
        if (state.selectedUser?.userId === action.payload.userId) {
          state.selectedUser = action.payload;
        }
        state.successMessage = 'User settings updated.';
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.isUpdating = false;
        state.updatingUserId = null;
        state.error = action.payload as string;
      });
  },
});

export const fetchAdminSettingsUsers = fetchAdminUsers;
export const { clearSettingsStatus, setSelectedUser, setSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
