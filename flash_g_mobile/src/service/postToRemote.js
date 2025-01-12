import axios from 'axios';
import {REACT_APP_URL} from '../../enviroment';

export async function updateDeskToRemote(accessToken, desk) {
  console.log(REACT_APP_URL);
  axios
    .put(`http://${REACT_APP_URL}/api/desk/${desk._id}`, desk, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log('Update data successfully !');
    })
    .catch(err => {
      console.log('Update desk to remote error with message:', err);
    });
}

export async function updateCardToRemote(accessToken, card) {
  axios
    .put(`http://${REACT_APP_URL}/api/card/${card._id}`, card, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log('Update data successfully');
    })
    .catch(err => {
      console.log('Update card to remote error with message:', err);
    });
}
