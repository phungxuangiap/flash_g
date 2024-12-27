import axios from 'axios';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {store} from '../redux/store';
import {setLoading} from '../redux/slices/stateSlice';
import {Alert} from 'react-native';
import {REACT_APP_URL} from '@env';

const login = async (email, password) => {
  return await axios
    .post(`http://${REACT_APP_URL}/api/user/login`, {
      email,
      password,
    })
    .then(res => {
      if (res.data.access_token) {
        return res.data.access_token;
      }
    });
};

export {login};
