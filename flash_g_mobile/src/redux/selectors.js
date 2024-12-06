const loadingSelector = state => {
  return state.state.loading;
};
const accessTokenSelector = state => {
  return state.auth.accessToken;
};

export {loadingSelector, accessTokenSelector};
