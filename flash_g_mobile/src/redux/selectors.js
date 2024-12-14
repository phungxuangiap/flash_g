const loadingSelector = state => {
  return state.state.loading;
};
const accessTokenSelector = state => {
  return state.auth.accessToken;
};
const deskSelector = state => {
  return state.desk.currentDesk;
};
export {loadingSelector, accessTokenSelector, deskSelector};
