import axios from 'axios';
import {REACT_APP_URL} from '../../env';

export function fetchUserById(authorId, accessToken) {
  return axios
    .get(`http://${REACT_APP_URL}/api/user/${authorId}`, {
      headers: {Authorization: `Bearer ${accessToken}`},
    })
    .catch(err => {
      console.log('Get user by id error with message:', err);
    });
}
