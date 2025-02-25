import {createSlice} from '@reduxjs/toolkit';
import {LightMode} from '../../constants';

const initialState = {
  loading: false,
  db: null,
  online: true,
  images: {},
  mode: LightMode,
  restrictMode: 0,
};

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setLoading: (state, actions) => {
      state.loading = actions.payload;
    },
    setDatabase: (state, actions) => {
      state.db = actions.payload;
    },
    setOnline: (state, actions) => {
      state.online = actions.payload;
    },
    setImages: (state, actions) => {
      state.images = actions.payload;
    },
    setMode: (state, actions) => {
      state.mode = actions.payload;
    },
    setRestrictMode: (state, actions) => {
      state.restrictMode = actions.payload;
    },
  },
});
export default stateSlice;
export const {
  setLoading,
  setDatabase,
  setOnline,
  setImages,
  setMode,
  setRestrictMode,
} = stateSlice.actions;
