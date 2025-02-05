import axios from 'axios';
import {REACT_APP_URL} from '../../enviroment';
import {refresh} from './refreshAccessToken';

export async function updateDeskToRemote(accessToken, desk, dispatch) {
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
      refresh(dispatch);
      console.log(
        `Update desk having id: ${desk._id} to remote error with message:`,
        err,
      );
    });
}

export async function updateCardToRemote(accessToken, card, dispatch) {
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
      refresh(dispatch);
      console.log('Update card to remote error with message:', err);
    });
}

export async function deleteDeskInRemote(accessToken, desk, dispatch) {
  axios
    .delete(`http://${REACT_APP_URL}/api/desk/${desk._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log('Delete Desk successfully');
    })
    .catch(err => {
      refresh(dispatch);
      console.log('Delete desk to remote error with message:', err);
    });
}

export async function deleteCardInRemote(accessToken, card, dispatch) {
  axios
    .delete(`http://${REACT_APP_URL}/api/card/${card._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log('Update data successfully');
    })
    .catch(err => {
      refresh(dispatch);
      console.log('Update card to remote error with message:', err);
    });
}
