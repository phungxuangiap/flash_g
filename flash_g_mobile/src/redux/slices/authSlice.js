import {createSlice} from '@reduxjs/toolkit';
import {AUTH, NO_AUTH} from '../../constants';

const initialState = {
  authState: NO_AUTH,
  accessToken: null,
  user: {},
};
const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    changeAuth: state => {
      state.authState = state.authState === NO_AUTH ? AUTH : NO_AUTH;
    },
    refreshAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {changeAuth, refreshAccessToken, setUser} = authSlice.actions;
export default authSlice;
