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

// Flow ở đây sẽ là:
// ++++Khi đăng nhập+++++++
// Khi Login/Register thành công
// => Lưu current user vào redux, vào local storage
// => Navigate tới DeskBoardScreen + Set loading = true
// => Fetch tất cả current desk của user, khởi tạo current desk ở local user_id = {}
// => Duyệt từng desk và fetch tất cả các current cards của desk đó
//    lưu vào local với định dạng desk_id = {card_id: card}, tính toán số lượng card của mỗi status,
//    Tạo instance của Desk và Lưu vào current desk user_id.desk_id = desk: user_id = {desk_id: desk};
//    Lưu current desks vào redux (Chung định dạng với ở localstorage)
// => Render list current desk ra màn hình (useEffect + deps currentDesk)
// => Set loading = false
// ++++++Khi navigate từ item khác của bottomNavBar hoặc GameScreen tới deskScreen (Sử dụng useEffect với deps là currentCards)++++++++
// => Trong khi chơi game thì cập nhật state của 3 biến useState của màn hình game, khi out màn hình game thì set lại state của currentdesk và currentDesk của local storagestorage
// => Sử dụng currentDesk state ở redux để render.
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
      .then(res => {
        // Store desks to user_id key
        let objectDeskData = {};
        respone.data.forEach(item => {
          objectDeskData[item._id] = item;
        });
        dispatch(setUser(res.data));
        return storeData(res.data._id, JSON.stringify(objectDeskData));
      })
      .catch(err => {
        console.log('Get user error with message:', err);
      });
    return respone;
  }
  async function fetchAllCurrentCard(deskId) {
    await axios
      .get(`http://192.168.102.15:5001/api/card/${deskId}`)
      .then(res => {
        console.log(`Get all current card of id ${deskId} successfully`);
        let mapCurrentCards = {};
        res.data.forEach(item => {
          mapCurrentCards[item._id] = item;
        });
        return storeData(deskId, JSON.stringify(mapCurrentCards));
      })
      .catch(err => {
        console.log('Get current cards error with message:', err);
      });
  }
  async function FetchAllCards(listDesks) {
    listDesks.forEach(element => {
      if (element._id) {
        fetchAllCurrentCard(element._id);
      } else {
        console.log('Card is not valid');
      }
    });
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
        return await FetchAllCards(res.data);
      })
      .catch(async err => {
        console.log('Get all desks error with message ', err);
        return await refresh();
      })
      .finally(() => {
        console.log('END');
        dispatch(setLoading(false));
      });
  }
  // This call each time move to bottom bar navigation: Fetch remote data, store data in local storage and update redux state
  useEffect(() => {
    fetchAllInfos(actk);
  }, []);
  // This call each time navigate from another bottombar navigation item to desk screen: Fetch local data, update redux state
  async function getDataLocal() {
    if (currentUser && currentUser._id) {
      const listCurrentDesk = await getData(currentUser._id);
    }
    // if (listCurrentDesk) {
    //   listCurrentDesk.forEach(item => {});
    // }
  }
  // mỗi lần về desk sẽ tính toán lại new, inprogress, preview của từng desk và cập nhật lại trong desk object
  useFocusEffect(
    React.useCallback(() => {
      getDataLocal();
    }, [currentUser]),
  );
  return loading ? (
    <LoadingOverlay />
  ) : (
    <View style={{flex: 1, justifyContent: 'space-between', paddingBottom: 24}}>
      {/* <ScrollView scrollEnabled={true}>
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
      </ScrollView> */}
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
