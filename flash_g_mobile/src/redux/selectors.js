const loadingSelector = state => {
  return state.state.loading;
};
const accessTokenSelector = state => {
  return state.auth.accessToken;
};
const gameSelector = state => {
  return state.game.currentDesk;
};
const currentCardsSelector = state => {
  return state.game.currentCards;
};
export {
  loadingSelector,
  accessTokenSelector,
  gameSelector,
  currentCardsSelector,
};
