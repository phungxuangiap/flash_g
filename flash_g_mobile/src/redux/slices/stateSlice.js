import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setLoading: state => {
      state.loading = state.loading ? false : true;
    },
  },
});
export default stateSlice;
export const {setLoading} = stateSlice.actions;
