import React, {act, useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {accessTokenSelector} from '../../redux/selectors';
import axios from 'axios';
import {refresh} from '../../service/refreshAccessToken';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {store} from '../../redux/store';
import {TouchableOpacity} from 'react-native';
import {Text} from '@react-navigation/elements';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const navigation = useNavigation();
  const actk = useSelector(accessTokenSelector);
  const [id, setId] = useState(true);
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
        console.log('Get data error with message ', err);
        await refresh();
      });
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchData(actk);
    }, [actk, navigation]),
  );
  return (
    <>
      <TouchableOpacity
        style={{backgroundColor: 'blue'}}
        onPress={() => {
          setId(preState => !preState);
        }}>
        <Text>Click me</Text>
      </TouchableOpacity>
    </>
  );
}
