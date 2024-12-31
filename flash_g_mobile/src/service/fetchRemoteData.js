import axios from 'axios';
import {REACT_APP_URL} from '@env';
import {storeData} from './asyncStorageService';
import {setUser} from '../redux/slices/authSlice';

// Fetch current user and store in local storage, update redux state
export async function fetchCurrentUser(accessToken) {
  return await axios
    .get(`http://${process.env.REACT_APP_URL}/api/user/current`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log('Get user error with message:', err);
    });
}

// Fetch current desks, set initial value of current desks in local: user_id = {}
export async function fetchListDesks(accessToken, userId) {
  let mapDesks = [];
  return await axios
    .get(`http://${process.env.REACT_APP_URL}/api/desk/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      res.data.forEach(item => {
        mapDesks.push(item);
      });
      return mapDesks;
    })
    .catch(err => {
      console.log('Get all desk error with message:', err);
      console.log('Cannot connect to remote server!');

      return false;
    });
}

// Fetch all current cards of a desk, store in local storage with format desk_id = {card_id: card}, return object containing 3 status of card
export async function fetchAllCurrentCardOfDesk(deskId) {
  return await axios
    .get(`http://${process.env.REACT_APP_URL}/api/card/${deskId}`)
    .then(res => {
      console.log(`Get all current card of id ${deskId} successfully`);
      return res.data;
    })
    .catch(err => {
      console.log('Get current cards error with message:', err);
    });
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

export async function fetchAllCards() {
  return axios.get(`http://${process.env.REACT_APP_URL}/api/card`).then(res => {
    return res.data;
  });
}
