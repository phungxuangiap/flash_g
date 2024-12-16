import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentDesk: undefined,
  currentCards: [],
};

const gameSlice = createSlice({
  name: 'desk',
  initialState: initialState,
  reducers: {
    updateCurrentDesk: (state, action) => {
      state.currentDesk = action.payload;
    },
    updateCurrentCards: (state, action) => {
      state.currentCards = action.payload;
    },
  },
});

export default gameSlice;
export const {updateCurrentDesk, updateCurrentCards} = gameSlice.actions;
