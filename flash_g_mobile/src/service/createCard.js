import axios from 'axios';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {refresh} from './refreshAccessToken';
import {REACT_APP_URL} from '../../enviroment';

export default async function createCard(
  accessToken,
  deskId,
  vocab,
  sentence,
  description,
) {
  console.log(REACT_APP_URL);
  await axios
    .post(
      `http://${REACT_APP_URL}/api/card/${deskId}`,
      {
        vocab,
        description,
        sentence,
        vocab_audio: null,
        sentence_audio: null,
        last_preview: JSON.stringify(new Date()).slice(1, -1),
        modified_time: JSON.stringify(new Date()).slice(1, -1),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log('Create card successfully');
    })
    .catch(async err => {
      console.log('Create new card error with message:', err);
    });
}
