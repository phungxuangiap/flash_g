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
      return res.data;
    })
    .catch(err => {
      console.log('Add image to cloudinary error with message:', err);
    });
};

export const createImage = async function (image, deskId, accessToken) {
  return axios
    .post(
      `http://${REACT_APP_URL}/api/image/${deskId}`,
      {
        img_url: image.img_url,
        type: image.type,
        modified_time: image.modified_time,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      console.log('Create new image in remote successfully');
      return res;
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
      return res.data;
    })
    .catch(err => {
      console.log('Fetch image of desk error with message:', err);
    });
};

export const fetchImagesOfDesks = async function (accessToken, listDeskIds) {
  return axios
    .get(
      `http://${REACT_APP_URL}/api/image/`,
      {list_desk: listDeskIds},
      {
        params: {
          multiple_desk: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(response => {
      console.log(response);
      return response.data;
    })
    .catch(error => {
      console.log('Get All Images of Desks error with message:', error);
    });
};

export const updateImageOfDesk = async function (
  accessToken,
  deskId,
  updatedImage,
) {
  return axios
    .put(
      `http://${REACT_APP_URL}/api/image/${deskId}`,
      {
        img_url: updatedImage.img_url,
        type: updatedImage.type,
        modified_time: updatedImage.modified_time,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then(res => {
      return;
    });
};
