const loadingSelector = state => {
  return state.state.loading;
};
const accessTokenSelector = state => {
  return state.auth.accessToken;
};
const userSelector = state => {
  return state.auth.user;
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
  userSelector,
};
