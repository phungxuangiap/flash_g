import axios from 'axios';
import {store} from '../redux/store';
import {refreshAccessToken} from '../redux/slices/authSlice';
import {REACT_APP_URL} from '../../enviroment';

const refresh = async dispatch => {
  console.log(REACT_APP_URL);
  await axios
    .get(`http://${REACT_APP_URL}/api/user/refresh`)
    .then(res => {
      console.log('[CHANGE ACCESSTOKEN]');
      dispatch(refreshAccessToken(res.data.access_token));
    })
    .then(res => {
      console.log('refresh successfully ');
    })
    .catch(err => {
      console.log('err in refresh');
      console.log(err);
    });
};

export {refresh};
