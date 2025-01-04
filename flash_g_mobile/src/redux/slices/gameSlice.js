import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentDesk: undefined,
  currentDesks: [],
  currentCards: [],
};

const gameSlice = createSlice({
  name: 'desk',
  initialState: initialState,
  reducers: {
    updateCurrentDesk: (state, action) => {
      state.currentDesk = action.payload;
    },
    // All active cards of desk
    // If you wanna get all cards of desk, please add another state named allCardsOfDesk
    updateCurrentCards: (state, action) => {
      state.currentCards = action.payload;
    },
    updateCurrentDesks: (state, action) => {
      state.currentDesks = action.payload;
    },
  },
});

export default gameSlice;
export const {updateCurrentDesk, updateCurrentCards, updateCurrentDesks} =
  gameSlice.actions;
