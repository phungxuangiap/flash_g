import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {accessTokenSelector} from '../../redux/selectors';
import axios from 'axios';
import {refresh} from '../../service/refreshAccessToken';
import {useNavigation} from '@react-navigation/native';
import {store} from '../../redux/store';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const navigation = useNavigation();
  function fetchData(accessToken) {
    axios
      .get('http://192.168.102.15:5001/api/desk/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        console.log('Get data successfully');
        setData(res.data);
      })
      .catch(async err => {
        console.log('Get data error with error ', err);
        await refresh();
        console.log(
          'Refresh Token successfully with new token: ',
          store.getState().auth.accessToken,
        );
        fetchData(store.getState().auth.accessToken);
      });
  }
  useEffect(() => {
    navigation.addListener('tabPress', e => {
      let accessToken = store.getState().auth.accessToken;
      fetchData(accessToken);
    });
  }, []);
  return <></>;
}
