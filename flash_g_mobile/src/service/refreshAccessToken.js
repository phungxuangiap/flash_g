import axios from 'axios';
import {store} from '../redux/store';
import {refreshAccessToken} from '../redux/slices/authSlice';
import {REACT_APP_URL} from '../../env';

const refresh = async dispatch => {
  console.log('DISPATCH', dispatch);
  return await axios
    .get(`http://${REACT_APP_URL}/api/user/refresh`)
    .then(res => {
      console.log('refresh successfully ');
      dispatch(refreshAccessToken(res.data.access_token));
      return res.data.access_token;
    });
};

export {refresh};
