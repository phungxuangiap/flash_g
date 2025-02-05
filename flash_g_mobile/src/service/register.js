import axios from 'axios';
import {Alert} from 'react-native';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {REACT_APP_URL} from '../../enviroment';

const register = async (email, password, user_name, full_name) => {
  console.log(REACT_APP_URL);
  return await axios
    .post(`http://${REACT_APP_URL}/api/user/register`, {
      user_name,
      password,
      email,
      full_name,
    })
    .then(res => {
      console.log('Ahihi', res.data.access_token);
      return res.data.access_token;
    });
};

export {register};
