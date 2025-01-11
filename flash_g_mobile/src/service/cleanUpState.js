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
import {setDatabase, setLoading, setOnline} from '../redux/slices/stateSlice';
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
}
