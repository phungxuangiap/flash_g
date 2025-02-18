import axios from 'axios';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {refresh} from './refreshAccessToken';
import {REACT_APP_URL} from '../../env';

export default async function createCard(accessToken, deskId, card) {
  console.log(REACT_APP_URL);
  return await axios
    .post(
      `http://${REACT_APP_URL}/api/card/${deskId}`,
      {
        vocab: card.vocab,
        description: card.description,
        sentence: card.sentence,
        vocab_audio: null,
        sentence_audio: null,
        last_preview: card.last_preview,
        modified_time: card.modified_time,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log('Create card successfully');
      console.log('NEWCARD', res.data);
      return res.data;
    })
    .catch(async err => {
      console.log('Create new card error with message:', err);
    });
}
