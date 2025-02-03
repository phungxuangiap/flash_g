import axios from 'axios';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {refresh} from './refreshAccessToken';
import {updateCurrentDesks} from '../redux/slices/gameSlice';
import {REACT_APP_URL} from '../../enviroment';

export default async function createDesk(
  title,
  primary_color,
  accessToken,
  data,
  dispatch,
) {
  console.log(REACT_APP_URL);
  await axios
    .post(
      `http://${REACT_APP_URL}/api/desk`,
      {
        title,
        primary_color,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      dispatch(updateCurrentDesks([...data, res.data]));
      console.log('Create desk successfully');
    })
    .catch(async err => {
      console.log(err);
      await refresh();
      createDesk(title, primary_color, store.getState().auth.accessToken);
    });
}
