import axios from 'axios';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {refresh} from './refreshAccessToken';
import {REACT_APP_URL} from '@env';
import {updateCurrentDesks} from '../redux/slices/gameSlice';

export default async function createDesk(
  title,
  primary_color,
  accessToken,
  data,
  dispatch,
) {
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
      console.log(data, res);
      dispatch(updateCurrentDesks([...data, res.data]));
      console.log('Create desk successfully');
    })
    .catch(async err => {
      console.log(err);
      await refresh();
      createDesk(title, primary_color, store.getState().auth.accessToken);
    });
}
