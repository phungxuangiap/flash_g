import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import stateSlice from './slices/stateSlice';
import deskSlice from './slices/deskSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    state: stateSlice.reducer,
    desk: deskSlice.reducer,
  },
});
