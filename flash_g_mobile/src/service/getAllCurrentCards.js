import axios from 'axios';
import {updateCurrentCards} from '../redux/slices/gameSlice';
import {store} from '../redux/store';

export default async function getAllCurrentCards(deskId, dispatch) {
  await axios
    .get(`http://192.168.102.15:5001/api/card/${deskId}`, {
      params: {current: true},
    })
    .then(res => {
      console.log(res.data);
      dispatch(updateCurrentCards(res.data));
    })
    .catch(err => {
      console.log('Got all current cards error with message: ', err);
    });
}
