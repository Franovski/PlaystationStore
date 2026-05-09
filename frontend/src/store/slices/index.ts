import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import gamesReducer from './gamesSlice';
import categoriesReducer from './categoriesSlice';
import platformsReducer from './platformsSlice';
import dlcReducer from './dlcSlice';
import ordersReducer from './ordersSlice';
import wishlistReducer from './wishlistSlice';
import reviewsReducer from './reviewsSlice';
import dashboardReducer from './dashboardSlice';
import adminReducer from './adminSlice';
import libraryReducer from './librarySlice';

const rootReducer = combineReducers({
  auth: authReducer,
  games: gamesReducer,
  categories: categoriesReducer,
  platforms: platformsReducer,
  dlc: dlcReducer,
  orders: ordersReducer,
  wishlist: wishlistReducer,
  reviews: reviewsReducer,
  dashboard: dashboardReducer,
  admin: adminReducer,
  library: libraryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
