import axios from 'axios';
import {store} from '../redux/store';
import {useSelector} from 'react-redux';

const logout = accessToken => {
  axios
    .post(
      'http://192.168.102.15:5001/api/user/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
};

export {logout};
