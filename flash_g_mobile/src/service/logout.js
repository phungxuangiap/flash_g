import axios from 'axios';
import {store} from '../redux/store';
import {useSelector} from 'react-redux';
import {refresh} from './refreshAccessToken';
import {getLocalDatabase} from '../LocalDatabase/databaseInitialization';
import {cleanUp} from '../LocalDatabase/database';
import {cleanUpStateAfterLoggingOut} from './cleanUpState';
import {REACT_APP_URL} from '../../enviroment';

const logout = async accessToken => {
  console.log(REACT_APP_URL);
  await axios
    .post(`http://${REACT_APP_URL}/api/user/logout`, {
      body: 'body of logout post request',
    })
    .then(async res => {
      await cleanUp();
      cleanUpStateAfterLoggingOut();
      console.log(res.data);
    })
    .catch(async err => {
      console.log('[ERROR]', err);
      // await refresh();
      // logout(store.getState().auth.accessToken);
    });
};

export {logout};
