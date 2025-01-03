import {changeAuth, setUser} from '../redux/slices/authSlice';
import {
  updateCurrentCards,
  updateCurrentDesk,
  updateCurrentDesks,
} from '../redux/slices/gameSlice';
import {store} from '../redux/store';

export function cleanUpStateAfterLoggingOut() {
  store.dispatch(changeAuth());
  store.dispatch(setUser({}));
  store.dispatch(updateCurrentCards([]));
  store.dispatch(updateCurrentDesk([]));
  store.dispatch(updateCurrentDesks([]));
}
