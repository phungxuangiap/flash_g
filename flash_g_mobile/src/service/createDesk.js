import axios from 'axios';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {refresh} from './refreshAccessToken';
import {updateCurrentDesks} from '../redux/slices/gameSlice';
import {REACT_APP_URL} from '../../enviroment';

export default async function createDeskInRemote(
  title,
  primary_color,
  description,
  modified_time,
  status,
  accessToken,
) {
  return await axios
    .post(
      `http://${REACT_APP_URL}/api/desk`,
      {
        title,
        primary_color,
        description,
        access_status: status ? status : 'PUBLIC',
        modified_time,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log('Create desk successfully');
      return res.data;
    })
    .catch(async err => {
      console.log('Create new desk error with message:', err);
    });
}
