import axios from 'axios';
import {REACT_APP_URL} from '../../enviroment';

export const addImageToCloudinary = async function (file, accessToken) {
  const data = new FormData();
  data.append('my_file', file);
  return axios
    .post(`http://${REACT_APP_URL}/api/image/upload`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      console.log(res.path);
    })
    .catch(err => {
      console.log('Add image to cloudinary error with message:', err);
    });
};

export const createImage = async function (img_url, deskId, accessToken) {
  return axios.post(
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
  );
};
