import axios from 'axios';
import {Alert} from 'react-native';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {REACT_APP_URL} from '@env';

const register = async (email, password, user_name) => {
  return await axios
    .post(`http://${process.env.REACT_NATIVE_APP_URL}/api/user/register`, {
      user_name,
      password,
      email,
    })
    .then(res => {
      console.log('Ahihi', res.data.access_token);
      return res.data.access_token;
    });
};

export {register};
