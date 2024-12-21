import axios from 'axios';
import {Alert} from 'react-native';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {REACT_APP_URL} from '@env';

const register = (email, password, user_name, navigateToAnotherScreen) => {
  axios
    .post(`http://${REACT_APP_URL}/api/user/register`, {
      user_name,
      password,
      email,
    })
    .then(res => {
      store.dispatch(refreshAccessToken(res.data.access_token));
      store.dispatch(changeAuth());
    })
    .catch(err => {
      Alert.alert('Email is already exist');
      console.log(err);
    });
};

export {register};
