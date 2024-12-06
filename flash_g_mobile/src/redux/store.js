import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import stateSlice from './slices/stateSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    state: stateSlice.reducer,
  },
});
