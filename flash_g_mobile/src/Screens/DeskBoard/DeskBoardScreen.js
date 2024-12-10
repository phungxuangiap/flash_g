import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {accessTokenSelector} from '../../redux/selectors';
import axios from 'axios';
import {refresh} from '../../service/refreshAccessToken';
import {useNavigation} from '@react-navigation/native';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const accessToken = useSelector(accessTokenSelector);
  const [data, setData] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.addListener('tabPress', e => {
      axios
        .get('http://192.168.102.15:5001/api/desk/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(res => {
          console.log(res.data);
          setData(res.data);
        })
        .catch(err => {
          refresh();
          console.log(err);
        });
    });
  }, []);
  return <></>;
}
