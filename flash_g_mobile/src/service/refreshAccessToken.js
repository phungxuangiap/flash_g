import axios from 'axios';
import {store} from '../redux/store';
import {refreshAccessToken} from '../redux/slices/authSlice';

const refresh = async dispatch => {
  await axios
    .get(`http://${process.env.REACT_APP_URL}/api/user/refresh`)
    .then(res => {
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
