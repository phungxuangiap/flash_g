import axios from 'axios';

export async function updateListDeskToRemote(accessToken, desk) {
  axios.put(
    `http://${process.env.REACT_APP_URL}/api/desk/${desk_id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}
