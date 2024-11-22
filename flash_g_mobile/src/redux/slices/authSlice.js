import {createSlice} from '@reduxjs/toolkit';
import {AUTH, NO_AUTH} from '../../constants';

const authSlice = createSlice({
  name: 'auth',
  initialState: NO_AUTH,
  reducers: {
    changeAuth: state => {
      state = state == NO_AUTH ? AUTH : NO_AUTH;
    },
  },
});

export const {changeAuth} = authSlice.actions;
export default authSlice;
