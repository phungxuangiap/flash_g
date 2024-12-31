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
import {Card, MainGame} from '../../constants';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const data = useSelector(currentDesks);
  const navigation = useNavigation();
  const actk = useSelector(accessTokenSelector);
  const loading = useSelector(loadingSelector);
  const [inputCreateDesk, setInputCreateDesk] = useState('');
  const [showCreateDesk, setShowCreateDesk] = useState(false);
  const currentUser = useSelector(userSelector);
  async function handleData() {
    Promise.resolve()
      // Fetch current user, update state, store local
      .then(async () => {
        const user = await fetchCurrentUser(actk);
        dispatch(setUser(user));
        await createNewUser(user);
        return user;
      })
      // Fetch all Desks
      .then(async user => {
        if (user) {
          return fetchListDesks(actk, user._id);
        } else {
          return false;
        }
      })
      // Fetch all Cards
      .then(async listDesk => {
        if (listDesk) {
          const listAllRemoteCards = await fetchAllCards().catch(err => {
            console.log('Get all remote cards error with message:', err);
            console.log('Cannot connect to remote server!');
            return false;
          });
          const synchronizedListCards = await syncAllCards(listAllRemoteCards);
          await Promise.all(
            synchronizedListCards.map(card => {
              return updateCard(card);
            }),
          );
          return listDesk;
        } else {
          console.log('Cannot connect to remote server!');
          return false;
        }
      })
      // Get all current card and calculate, return list new desks
      .then(async listDesks => {
        let listLocalDesk = listDesks;
        if (!listLocalDesk) {
          listLocalDesk = await getListDesks();
        }
        return Promise.all(
          listLocalDesk.map(desk => {
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
      // Update list updated desks in state
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
                  navigation.navigate(MainGame);
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
