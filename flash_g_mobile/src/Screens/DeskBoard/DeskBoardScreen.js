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
  currentDesks,
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
import {
  updateCurrentDesk,
  updateCurrentDesks,
} from '../../redux/slices/gameSlice';
import {setUser} from '../../redux/slices/authSlice';
import {getData, storeData} from '../../service/asyncStorageService';
import {REACT_APP_URL} from '@env';
import {
  fetchAllCurrentCardOfDesk,
  fetchListDesks,
  fetchCurrentUser,
} from '../../service/fetchRemoteData';
// Flow ở đây sẽ là:
// ++++Khi đăng nhập+++++++
// Khi Login/Register thành công:
// => Navigate tới DeskBoardScreen + Set loading = true DONE
// => Lưu current user vào redux, vào local storage DONE
// => Fetch tất cả current desk của user, khởi tạo current desk ở local user_id = {} DONE
// => Duyệt từng desk và fetch tất cả các current cards của desk đó
//    lưu vào local với định dạng desk_id = {card_id: card}, tính toán số lượng card của mỗi status,
//    Tạo instance của Desk và Lưu vào current desk user_id.desk_id = desk: user_id = {desk_id: desk};
//    Lưu current desks vào redux (Khác với định dạng ở local, là một mảng) DONE
// => Render list current desk ra màn hình (useEffect + deps currentDesk)
// => Set loading = false
// ++++++Khi navigate từ item khác của bottomNavBar hoặc GameScreen tới deskScreen (Sử dụng useEffect với deps là currentCards)++++++++
// => Trong khi chơi game thì cập nhật state của 3 biến useState của màn hình game, khi out màn hình game thì set lại state của currentdesk và currentDesk của local storagestorage
// => Sử dụng currentDesk state ở redux để render.
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const data = useSelector(currentDesks);
  const navigation = useNavigation();
  const actk = useSelector(accessTokenSelector);
  const loading = useSelector(loadingSelector);
  const [inputCreateDesk, setInputCreateDesk] = useState('');
  const [showCreateDesk, setShowCreateDesk] = useState(false);
  const currentUser = useSelector(userSelector);

  async function fetchAllInfo() {
    dispatch(setLoading(true));

    // Fetch current user and store in local storage, update redux state
    const objectCurrentDesks = {};
    const listCurrentDesks = [];
    await fetchCurrentUser(actk, dispatch);
    console.log('after get user');
    // Fetch all current desk of user, init current desks in local with user_id = {}
    const mapDesks = await fetchListDesks(actk, store.getState().auth.user._id);
    // Go through each desk and fetch all current cards of this desk
    await Promise.all(
      mapDesks.map(async element => {
        if (element._id) {
          const status = await fetchAllCurrentCardOfDesk(element._id);
          // update current desk in local storage
          const newDesk = {
            user_id: store.getState().auth.user._id,
            _id: element._id,
            title: element.title,
            primary_color: element.primary_color,
            new_card: status.new,
            inprogress_card: status.in_progress,
            preview_card: status.preview,
          };
          objectCurrentDesks[element._id] = newDesk;
          listCurrentDesks.push(newDesk);
        }
      }),
    );
    // Store list current desks updated in local storage
    await storeData(
      store.getState().auth.user._id,
      JSON.stringify(objectCurrentDesks),
    );
    // Store list current desks updated in redux

    dispatch(updateCurrentDesks(listCurrentDesks));
    dispatch(setLoading(false));
  }
  // This call each time move to bottom bar navigation: Fetch remote data, store data in local storage and update redux state
  useEffect(() => {
    fetchAllInfo(actk);
  }, []);
  // This call each time navigate from another bottombar navigation item to desk screen: Fetch local data, update redux state
  // mỗi lần về desk sẽ tính toán lại new, inprogress, preview của từng desk và cập nhật lại trong desk object
  useFocusEffect(
    React.useCallback(() => {
      // getDataLocal();
      return () => {
        console.log('unmount');
      };
    }, []),
  );
  return loading ? (
    <LoadingOverlay />
  ) : (
    <View style={{flex: 1, justifyContent: 'space-between', paddingBottom: 24}}>
      <ScrollView scrollEnabled={true}>
        {data &&
          data.map((item, index) => {
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
              await createDesk(inputCreateDesk, 'black', actk, data, dispatch);
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
