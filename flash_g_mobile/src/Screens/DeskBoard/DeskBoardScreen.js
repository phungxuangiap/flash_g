import React, {
  act,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
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
  fetchAllCards,
} from '../../service/fetchRemoteData';
import {
  createNewDesk,
  createNewUser,
  getAllCards,
  getListCurrentCardsOfDesk,
  getListDesks,
  getUser,
  updateCard,
  updateDesk,
} from '../../LocalDatabase/database';
import {
  syncAllCards,
  syncAllDesks,
  syncCurrentCards,
  syncListCardsOfDesk,
} from '../../LocalDatabase/syncDBService';
import {Desk} from '../../LocalDatabase/model';
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

  async function handleData() {
    // Fetch current user, update state, store local
    fetchCurrentUser(actk)
      .then(async user => {
        dispatch(setUser(user));
        await createNewUser(user);
        return user;
      })
      // Fetch all Desks
      .then(async user => {
        const listDesk = await fetchListDesks(actk, user._id);
        return listDesk;
      })
      // Fetch all Cards
      .then(async listDesk => {
        const listAllRemoteCards = await fetchAllCards();
        const synchronizedListCards = await syncAllCards(listAllRemoteCards);
        await Promise.all(
          synchronizedListCards.map(card => {
            return updateCard(card);
          }),
        );
        return listDesk;
      })
      // Get all current card and calculate, return list new desks
      .then(async listDesks => {
        console.log('[LISTALLDESK]', listDesks);
        return Promise.all(
          listDesks.map(desk => {
            let news = 0;
            let inProgress = 0;
            let preview = 0;
            return getListCurrentCardsOfDesk(desk._id).then(
              async listCurrentCards => {
                console.log('[CURRENT_CARDS]', listCurrentCards);
                listCurrentCards.forEach(card => {
                  if (card.status === 'new') {
                    news++;
                  } else if (card.status === 'inprogress') {
                    inProgress++;
                  } else {
                    preview++;
                  }
                });
                return new Desk(
                  desk._id,
                  desk.user_id,
                  desk.title,
                  desk.primary_color,
                  news,
                  inProgress,
                  preview,
                  JSON.stringify(new Date()),
                );
              },
            );
          }),
        );
      })
      // Receive List desk with total calculated cards, update new desk into local database
      .then(listUpdatedDesks => {
        console.log('LIST_ALL_DESK', listUpdatedDesks);
        return Promise.all(
          listUpdatedDesks.map(desk => {
            return updateDesk(desk);
          }),
        );
      })
      .then(res => {
        return getListDesks().then(list => {
          let listDesks = [];
          list?.forEach(result => {
            for (let index = 0; index < result.rows.length; index++) {
              listDesks.push(result.rows.item(index));
            }
          });
          dispatch(updateCurrentDesks(listDesks));
        });
      })
      .catch(err => {
        console.log('Handle data error with message:', err);
      });
  }
  useEffect(() => {
    handleData();
  }, []);
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
