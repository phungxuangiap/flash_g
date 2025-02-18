import axios from 'axios';
import {REACT_APP_URL} from '../../env';

export async function updateDeskToRemote(accessToken, desk_remote_id, desk) {
  axios
    .put(`http://${REACT_APP_URL}/api/desk/${desk_remote_id}`, desk, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log('Update data successfully !');
    })
    .catch(err => {
      console.log(
        `Update desk having id: ${desk_remote_id} to remote error with message:`,
        err,
      );
    });
}

export async function updateCardToRemote(accessToken, card) {
  axios
    .put(`http://${REACT_APP_URL}/api/card/${card.remote_id}`, card, {
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

export async function deleteDeskInRemote(accessToken, deskId) {
  axios
    .delete(`http://${REACT_APP_URL}/api/desk/${deskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log('Delete Desk successfully');
    })
    .catch(err => {
      console.log('Delete desk to remote error with message:', err);
    });
}

export async function deleteCardInRemote(accessToken, card, dispatch) {
  axios
    .delete(`http://${REACT_APP_URL}/api/card/${card.remote_id}`, {
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
