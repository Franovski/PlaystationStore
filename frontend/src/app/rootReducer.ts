import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gamesReducer from '../features/games/gamesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  games: gamesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;