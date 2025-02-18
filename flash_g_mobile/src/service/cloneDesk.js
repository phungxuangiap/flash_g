import axios from 'axios';
import {REACT_APP_URL} from '../../env';
import {Alert} from 'react-native';

export const cloneDesk = function (accessToken, deskId) {
  return axios
    .post(
      `http://${REACT_APP_URL}/api/desk/${deskId}`,
      {},
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      },
    )
    .then(res => {
      Alert.alert('Clone successfully!');
      console.log('Clone desk successfully');
    })
    .catch(err => {
      Alert.alert("Something went wrong or you'd already owned this desk");
      console.log('Clone desk error with message:', err);
    });
};
