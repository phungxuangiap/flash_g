import React, {
  act,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  loadingSelector,
  userSelector,
} from '../../redux/selectors';
import axios from 'axios';
import {refresh} from '../../service/refreshAccessToken';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {store} from '../../redux/store';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '@react-navigation/elements';
import {setLoading} from '../../redux/slices/stateSlice';
import uuid from 'react-native-uuid';
import {
  CircleButton,
  CreateNewDeskPopUp,
  DeskComponent,
  LoadingOverlay,
  OverLay,
} from '../../appComponents/appComponents';
import createDesk from '../../service/createDesk';
import {updateCurrentDesk} from '../../redux/slices/gameSlice';
import {setUser} from '../../redux/slices/authSlice';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const actk = useSelector(accessTokenSelector);
  const loading = useSelector(loadingSelector);
  const [inputCreateDesk, setInputCreateDesk] = useState('');
  const [showCreateDesk, setShowCreateDesk] = useState(false);
  const currentUser = useSelector(userSelector);

  async function fetchCurrentUser(accessToken) {
    await axios
      .get('http://192.168.102.15:5001/api/user/current', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        dispatch(setUser(res.data));
        console.log('[USER]', store.getState().auth.user);
      })
      .catch(err => {
        console.log('Get user error with message:', err);
      });
  }
  async function fetchAllDesks(accessToken) {
    dispatch(setLoading(true));
    await axios
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
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
    fetchCurrentUser(accessToken);
  }
  function fetchAllCurrentCard() {}
  // This call each time move to bottom bar navigation: Fetch remote data, store data in local storage
  useEffect(() => {
    fetchAllDesks(actk);
    console.log('fetch remote');
  }, []);
  // This call each time navigate from another bottombar navigation item to desk screen: Fetch local data, update redux state
  useFocusEffect(
    React.useCallback(() => {
      console.log('fetch local');
    }, []),
  );
  return loading ? (
    <LoadingOverlay />
  ) : (
    <View style={{flex: 1, justifyContent: 'space-between', paddingBottom: 24}}>
      <ScrollView scrollEnabled={true}>
        {data.map((item, index) => {
          return (
            <DeskComponent
              key={uuid.v4()}
              title={item.title}
              primaryColor={item.primary_color}
              news={item.new_card}
              progress={item.inprogress_card}
              preview={item.preview_card}
              onClick={() => {
                dispatch(updateCurrentDesk(item));
                navigation.navigate('Playground');
              }}
            />
          );
        })}
      </ScrollView>
      <CircleButton
        style={{position: 'absolute', bottom: 12}}
        content={'+'}
        onClick={() => {
          setShowCreateDesk(preState => !preState);
        }}
      />
      {showCreateDesk ? (
        <>
          <OverLay />
          <CreateNewDeskPopUp
            input={inputCreateDesk}
            setInput={setInputCreateDesk}
            close={() => {
              setShowCreateDesk(preState => !preState);
            }}
            create={async () => {
              dispatch(setLoading(true));
              await createDesk(inputCreateDesk, 'black', actk, data, setData);
              dispatch(setLoading(false));
              setShowCreateDesk(false);
            }}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  );
}
