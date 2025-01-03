import axios from 'axios';
import {updateCurrentCards} from '../redux/slices/gameSlice';
import {store} from '../redux/store';
import {refreshAccessToken} from '../redux/slices/authSlice';

export default async function getAllCurrentCards(deskId, dispatch) {
  await axios
    .get(`http://${process.env.REACT_APP_URL}/api/card/${deskId}`, {
      params: {current: true},
    })
    .then(res => {
      console.log(res.data);
      dispatch(updateCurrentCards(res.data));
    })
    .catch(async err => {
      console.log('Got all current cards error with message: ', err);
    });
}
