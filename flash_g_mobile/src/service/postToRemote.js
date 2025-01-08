import axios from 'axios';

export async function updateDeskToRemote(accessToken, desk) {
  axios
    .put(`http://${process.env.REACT_APP_URL}/api/desk/${desk._id}`, desk, {
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
    .put(`http://${process.env.REACT_APP_URL}/api/card/${card._id}`, card, {
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
