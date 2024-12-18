import axios from 'axios';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {store} from '../redux/store';
import {setLoading} from '../redux/slices/stateSlice';
import {Alert} from 'react-native';

const login = (email, password, navigate) => {
  console.log(process.env.REACT_APP_URL);
  axios
    .post('http://192.168.102.15:5001/api/user/login', {
      email,
      password,
    })
    .then(res => {
      if (res.data.access_token) {
        store.dispatch(changeAuth());
        store.dispatch(refreshAccessToken(res.data.access_token));
        if (store.getState().state.loading) {
          store.dispatch(setLoading(false));
        }
        navigate('BottomBar');
        return true;
      }
    })
    .catch(err => {
      Alert.alert('Email or Password is invalid', '');
      console.log(err);
      if (store.getState().state.loading) {
        store.dispatch(setLoading(false));
      }
      return false;
    });
  return false;
};

export {login};
