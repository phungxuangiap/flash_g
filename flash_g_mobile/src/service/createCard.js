import axios from 'axios';
import {store} from '../redux/store';
import {changeAuth, refreshAccessToken} from '../redux/slices/authSlice';
import {setLoading} from '../redux/slices/stateSlice';
import {refresh} from './refreshAccessToken';

export default async function createCard(
  accessToken,
  desk,
  vocab,
  sentence,
  description,
  listCard,
  setListCard,
) {
  console.log(process.env.REACT_APP_URL);
  await axios
    .post(
      `http://${process.env.REACT_APP_URL}/api/card/${desk._id}`,
      {
        vocab,
        description,
        sentence,
        vocab_audio: null,
        sentence_audio: null,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log(res.data);
      setListCard([...listCard, res.data]);
      console.log('Create card successfully');
    })
    .catch(async err => {
      console.log(err);
      await refresh();
      createCard(
        store.getState().auth.accessToken,
        desk,
        vocab,
        sentence,
        description,
      );
    });
}
