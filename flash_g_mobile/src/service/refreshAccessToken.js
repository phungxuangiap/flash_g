import axios from 'axios';
import {store} from '../redux/store';
import {refreshAccessToken} from '../redux/slices/authSlice';

const refresh = () => {
  axios
    .get('http://192.168.102.15:5001/api/user/refresh')
    .then(res => {
      store.dispatch(refreshAccessToken(res.data.access_token));
      console.log('refresh successfully');
    })
    .catch(err => {
      console.log('err in refresh');
      console.log(err);
    });
};

export {refresh};
