import axios from 'axios';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {refresh} from './refreshAccessToken';

export default async function createDesk(
  title,
  primary_color,
  accessToken,
  data,
  setData,
) {
  await axios
    .post(
      'http://192.168.102.15:5001/api/desk',
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
      setData([...data, res.data]);
      console.log('Create desk successfully');
    })
    .catch(async err => {
      console.log(err);
      await refresh();
      createDesk(title, primary_color, store.getState().auth.accessToken);
    });
}
