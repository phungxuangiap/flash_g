import axios from 'axios';
import {REACT_APP_URL} from '../../enviroment';

export const addImageToCloudinary = async function (file, accessToken) {
  return axios
    .post(`http://${REACT_APP_URL}/api/image/upload`, file, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      console.log('Store Image in cloudinary successfully');
      return res.data.path;
    })
    .catch(err => {
      console.log('Add image to cloudinary error with message:', err);
    });
};

export const createImage = async function (img_url, deskId, accessToken) {
  return axios
    .post(
      `http://${REACT_APP_URL}/api/image/${deskId}`,
      {
        img_url,
        desk_id: deskId,
        modified_time: JSON.stringify(new Date()).slice(1, -1),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log('Create new image in remote successfully');
    })
    .catch(err => {
      console.log('Create new Image error with message:', err);
    });
};

export const fetchImageOfDesk = async function (accessToken, deskId) {
  return axios
    .get(`http://${REACT_APP_URL}/api/image/${deskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      return res.data.img_url;
    })
    .catch(err => {
      console.log('Fetch image of desk error with message:', err);
    });
};
