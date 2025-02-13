import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  db: null,
  online: true,
  images: {},
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
  },
});
export default stateSlice;
export const {setLoading, setDatabase, setOnline, setImages} =
  stateSlice.actions;
