import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState } from '../../types';
import { authApi } from '../../api/authApi';
import { tokenService } from '../../services/tokenService';

const initialState: AuthState = {
  user: null,
  accessToken: tokenService.getToken(),
  isAuthenticated: !!tokenService.getToken(),
  isLoading: false,
  error: null,
  requiresTwoFactor: false,
  tempToken: null,
  msg: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      if (response.requiresTwoFactor) {
        return { requiresTwoFactor: true, tempToken: response.tempToken };
      }
      if (response.accessToken) tokenService.setToken(response.accessToken);
      if (response.refreshToken) localStorage.setItem('ps_store_refresh_token', response.refreshToken);
      return response;
    } catch (err: any) {
      const errorMsg = Array.isArray(err?.message) ? err.message.join(' | ') : err?.message || 'Login failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const verifyTotp = createAsyncThunk(
  'auth/verifyTotp',
  async (data: { tempToken: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyTotp(data);
      if (response.accessToken) tokenService.setToken(response.accessToken);
      if (response.refreshToken) localStorage.setItem('ps_store_refresh_token', response.refreshToken);
      return response;
    } catch (err: any) {
      const errorMsg = Array.isArray(err?.message) ? err.message.join(' | ') : err?.message || 'Verification failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (err: any) {
      const errorMsg = Array.isArray(err?.message) ? err.message.join(' | ') : err?.message || 'Registration failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authApi.forgotPassword(email);
      return 'Password reset link sent to your email.';
    } catch (err: any) {
      const errorMsg = Array.isArray(err?.message) ? err.message.join(' | ') : err?.message || 'Request failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (data: Record<string, any>, { rejectWithValue }) => {
    try {
      await authApi.resetPassword(data);
      return 'Password successfully reset!';
    } catch (err: any) {
      const errorMsg = Array.isArray(err?.message) ? err.message.join(' | ') : err?.message || 'Reset failed';
      return rejectWithValue(errorMsg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Logout api failed', e);
    }
    dispatch(logout());
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.requiresTwoFactor = false;
      state.tempToken = null;
      tokenService.removeToken();
      localStorage.removeItem('ps_store_refresh_token');
    },
    clearError: (state) => {
      state.error = null;
      state.msg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true; state.error = null; state.msg = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.requiresTwoFactor) {
          state.requiresTwoFactor = true;
          state.tempToken = action.payload.tempToken || null;
        } else {
          state.isAuthenticated = true;
          state.user = action.payload.user || null;
          state.accessToken = action.payload.accessToken || null;
          state.requiresTwoFactor = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      // TOTP
      .addCase(verifyTotp.pending, (state) => {
        state.isLoading = true; state.error = null;
      })
      .addCase(verifyTotp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requiresTwoFactor = false;
        state.tempToken = null;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.accessToken = action.payload.accessToken || null;
      })
      .addCase(verifyTotp.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPasswordThunk.pending, (state) => { state.isLoading = true; state.error = null; state.msg = null; })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => { state.isLoading = false; state.msg = action.payload as string; })
      .addCase(forgotPasswordThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      // Reset Password
      .addCase(resetPasswordThunk.pending, (state) => { state.isLoading = true; state.error = null; state.msg = null; })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => { state.isLoading = false; state.msg = action.payload as string; })
      .addCase(resetPasswordThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;