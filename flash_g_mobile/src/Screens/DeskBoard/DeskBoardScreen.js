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
import {getData, storeData} from '../../service/asyncStorageService';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const actk = useSelector(accessTokenSelector);
  const loading = useSelector(loadingSelector);
  const [inputCreateDesk, setInputCreateDesk] = useState('');
  const [showCreateDesk, setShowCreateDesk] = useState(false);
  const currentUser = useSelector(userSelector);
  // Fetch current user, store in state, store all desk receiving from getAllDesk request to local storage with key is user_id
  async function fetchCurrentUser(accessToken, respone) {
    await axios
      .get('http://192.168.102.15:5001/api/user/current', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async res => {
        // Store desks to user_id key
        await storeData(res.data._id, JSON.stringify(respone.data));
        dispatch(setUser(res.data));
      })
      .catch(err => {
        console.log('Get user error with message:', err);
      });
    return respone;
  }
  async function fetchAllInfos(accessToken) {
    dispatch(setLoading(true));
    await axios
      .get('http://192.168.102.15:5001/api/desk/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        // fetch current user after we fetched all desk
        // return a promise to assure that fetchCurrentUser will be done before going down to the second .then
        return fetchCurrentUser(accessToken, res);
      })
      .then(async res => {
        console.log('Get all desks successfully');
        setData(res.data);
        res.data.forEach(element => {
          if (element._id) {
            fetchAllCurrentCard(element._id);
          } else {
            console.log('Card is not valid');
          }
        });
      })
      .catch(async err => {
        console.log('Get all desks error with message ', err);
        await refresh();
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }
  async function fetchAllCurrentCard(deskId) {
    await axios
      .get(`http://192.168.102.15:5001/api/card/${deskId}`)
      .then(res => {
        console.log(`Get all current card of id ${deskId} successfully`);
        return storeData(deskId, JSON.stringify(res.data));
      })
      .catch(err => {
        console.log('Get current cards error with message:', err);
      });
  }
  // This call each time move to bottom bar navigation: Fetch remote data, store data in local storage
  useEffect(() => {
    fetchAllInfos(actk);
  }, []);
  // This call each time navigate from another bottombar navigation item to desk screen: Fetch local data, update redux state
  async function getDataLocal() {}
  // mỗi lần về desk sẽ tính toán lại new, inprogress, preview của từng desk và cập nhật lại trong desk object
  useFocusEffect(
    React.useCallback(() => {
      getDataLocal();
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
