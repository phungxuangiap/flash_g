import {createSlice} from '@reduxjs/toolkit';
import {AUTH, NO_AUTH} from '../../constants';

const initialState = {
  authState: NO_AUTH,
  accessToken: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    changeAuth: state => {
      state.authState = state.authState === NO_AUTH ? AUTH : NO_AUTH;
    },
    refreshAccessToken: (state, payload) => {
      state.accessToken = payload.accessToken;
    },
  },
});

export const {changeAuth} = authSlice.actions;
export default authSlice;
