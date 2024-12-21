import axios from 'axios';
import {store} from '../redux/store';
import {useSelector} from 'react-redux';
import {refresh} from './refreshAccessToken';
import {REACT_APP_URL} from '@env';

const logout = async accessToken => {
  await axios
    .post(
      `http://${REACT_APP_URL}/api/user/logout`,
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
