import axios from 'axios';
import {storeData} from './asyncStorageService';
import {setUser} from '../redux/slices/authSlice';
import {refresh} from './refreshAccessToken';
import {REACT_APP_URL} from '../../enviroment';

// Fetch current user and store in local storage, update redux state
export function fetchCurrentUser(accessToken, dispatch) {
  console.log('fetch current user');
  return axios
    .get(`http://${REACT_APP_URL}/api/user/current`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(async err => {
      console.log(
        'Fetch user error with message',
        err,
        'and refresh to get a new token...',
      );
      await refresh(dispatch).catch(err => {
        console.log('Get user error with message:', err);
      });
    });
}

// Fetch current desks, set initial value of current desks in local: user_id = {}
export async function fetchListDesks(accessToken, userId, dispatch) {
  let mapDesks = [];
  return await axios
    .get(`http://${REACT_APP_URL}/api/desk/`, {
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
    .catch(async err => {
      console.log(
        'Fetch all desks error with message',
        err,
        'refresh to get a new token...',
      );
      await refresh(dispatch).catch(err => {
        console.log('Get all desk error with message:', err);
      });

      return false;
    });
}

// Fetch all current cards of a desk, store in local storage with format desk_id = {card_id: card}, return object containing 3 status of card
export async function fetchAllCurrentCardOfDesk(deskId) {
  return await axios
    .get(`http://${REACT_APP_URL}/api/card/${deskId}`)
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

export async function fetchAllCards(dispatch, accessToken) {
  return await axios
    .get(`http://${REACT_APP_URL}/api/card`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(async err => {
      console.log(
        'Fetch all cards met error',
        err,
        'and refresh a new token...',
      );
      await refresh(dispatch).catch(error => {
        console.log(
          'Fetch all cards after refreshing error with message:',
          error,
        );
      });
    });
}

export async function fetchAllGlobalDesks(accessToken) {
  return await axios
    .get(`http://${REACT_APP_URL}/api/desk?global=true`, {
      headers: {Authorization: `Bearer ${accessToken}`},
    })
    .then(res => {
      console.log('Get all global desks successfully!', res.data);
      return res.data;
    })
    .catch(err => {
      console.log('Get all global desks error with message:', err);
    });
}
