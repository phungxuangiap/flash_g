import axios from 'axios';
import {REACT_APP_URL} from '@env';
import {storeData} from './asyncStorageService';
import {setUser} from '../redux/slices/authSlice';

// Fetch current user and store in local storage, update redux state
export async function fetchCurrentUser(accessToken, dispatch) {
  await axios
    .get(`http://${REACT_APP_URL}/api/user/current`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      dispatch(setUser(res.data));
      return storeData('user', JSON.stringify(res.data));
    })
    .catch(err => {
      console.log('Get user error with message:', err);
    })
    .finally(() => {
      console.log('Get user done');
    });
}
// Fetch current desks, set initial value of current desks in local: user_id = {}
export async function fetchListDesks(accessToken, userId) {
  let mapDesks = [];
  await axios
    .get(`http://${REACT_APP_URL}/api/desk/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log('Get all desks successfully');
      res.data.forEach(item => {
        mapDesks.push(item);
      });
      return storeData(userId, JSON.stringify({}));
    })
    .catch(err => {
      console.log('Get all desks error with message:', err);
    });
  return mapDesks;
}

// Fetch all current cards of a desk, store in local storage with format desk_id = {card_id: card}, return object containing 3 status of card
export async function fetchAllCurrentCardOfDesk(deskId) {
  let mapCurrentCards = {};
  let status = {
    new: 0,
    in_progress: 0,
    preview: 0,
  };
  await axios
    .get(`http://${REACT_APP_URL}/api/card/${deskId}`)
    .then(res => {
      console.log(`Get all current card of id ${deskId} successfully`);
      res.data.forEach(item => {
        mapCurrentCards[item._id] = item;
        if (item.status === 'NEW') {
          status.new++;
        } else if (item.status === 'IN_PROGRESS') {
          status.in_progress++;
        } else {
          status.preview++;
        }
      });
      return storeData(deskId, JSON.stringify(mapCurrentCards));
    })
    .catch(err => {
      console.log('Get current cards error with message:', err);
    });
  return status;
}
export async function fetchAllCurrentCards(listDesks) {
  listDesks.forEach(element => {
    if (element._id) {
      fetchAllCurrentCardOfDesk(element._id);
    } else {
      console.log('Card is not valid');
    }
  });
}
