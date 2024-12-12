import axios from 'axios';
import {store} from '../redux/store';
import {useSelector} from 'react-redux';
import {refresh} from './refreshAccessToken';

const logout = async accessToken => {
  await axios
    .post(
      'http://192.168.102.15:5001/api/user/logout',
      {
        body: 'body of logout post request',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log(res.data);
    })
    .catch(async err => {
      console.log('[ERROR]', err);
      await refresh();
      logout(store.getState().auth.accessToken);
    });
};

export {logout};
