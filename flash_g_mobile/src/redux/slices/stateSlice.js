import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setLoading: (state, actions) => {
      state.loading = actions.payload;
    },
  },
});
export default stateSlice;
export const {setLoading} = stateSlice.actions;
