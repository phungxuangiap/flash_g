import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentDesk: undefined,
};

const deskSlice = createSlice({
  name: 'desk',
  initialState: initialState,
  reducers: {
    updateCurrentDesk: (state, action) => {
      state.currentDesk = action.payload;
    },
  },
});

export default deskSlice;
export const {updateCurrentDesk} = deskSlice.actions;
