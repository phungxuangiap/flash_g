import axios from 'axios';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {store} from '../redux/store';
import {setLoading} from '../redux/slices/stateSlice';
import {Alert} from 'react-native';

const login = (email, password, navigateToAnotherScreen) => {
  return axios
    .post('http://192.168.102.15:5001/api/user/login', {
      email,
      password,
    })
    .then(res => {
      if (res.data.access_token) {
        // store.dispatch(
        //   refreshAccessToken({accessToken: res.data.access_token}),
        // );
        console.log(res.data.access_token);
        store.dispatch(changeAuth());
        store.dispatch(refreshAccessToken(res.data.access_token));
        navigateToAnotherScreen();
      }
    })
    .catch(err => {
      store.dispatch(setLoading());
      Alert.alert('Email or Password is invalid', '');
      console.log(err);
    });
};

export {login};
