import {LightMode} from '../constants';
import {
  changeAuth,
  refreshAccessToken,
  setUser,
} from '../redux/slices/authSlice';
import {
  updateCurrentCards,
  updateCurrentDesk,
  updateCurrentDesks,
} from '../redux/slices/gameSlice';
import {
  setDatabase,
  setImages,
  setLoading,
  setMode,
  setOnline,
  setRestrictMode,
} from '../redux/slices/stateSlice';
import {store} from '../redux/store';

export function cleanUpStateAfterLoggingOut() {
  store.dispatch(changeAuth());
  store.dispatch(setUser({}));
  store.dispatch(updateCurrentCards([]));
  store.dispatch(updateCurrentDesk([]));
  store.dispatch(updateCurrentDesks([]));
  store.dispatch(setLoading(false));
  store.dispatch(setOnline(true));
  store.dispatch(refreshAccessToken(null));
  store.dispatch(setDatabase(null));
  store.dispatch(setImages({}));
  store.dispatch(setMode(LightMode));
  store.dispatch(setRestrictMode(0));
}
