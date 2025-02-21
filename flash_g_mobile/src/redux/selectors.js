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
const currentDesks = state => {
  return state.game.currentDesks;
};
const getLocalDatabaseSelector = state => {
  return state.state.db;
};
const onlineStateSelector = state => {
  return state.state.online;
};
const authStateSelector = state => {
  return state.auth.authState;
};
const imageStateSelector = state => {
  return state.state.images;
};
const modeStateSelector = state => {
  return state.state.mode;
};
export {
  loadingSelector,
  accessTokenSelector,
  gameSelector,
  currentCardsSelector,
  userSelector,
  currentDesks,
  getLocalDatabaseSelector,
  onlineStateSelector,
  authStateSelector,
  imageStateSelector,
  modeStateSelector,
};
