import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ordersApi, CreateOrderPayload } from '../../features/orders/services/ordersApi';
import { Order } from '../../types';

interface OrdersState {
  items: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrdersState = {
  items: [],
  currentOrder: null,
  isLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

const errorMessage = (err: unknown, fallback: string) =>
  err && typeof err === 'object' && 'message' in err
    ? String((err as { message?: string }).message)
    : fallback;

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await ordersApi.getAll();
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to fetch orders'));
  }
});

export const createOrder = createAsyncThunk('orders/create', async (payload: CreateOrderPayload, { rejectWithValue }) => {
  try {
    return await ordersApi.create(payload);
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to create order'));
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentOrder = action.payload;
        state.items.unshift(action.payload);
        state.successMessage = 'Order created.';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrdersStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
