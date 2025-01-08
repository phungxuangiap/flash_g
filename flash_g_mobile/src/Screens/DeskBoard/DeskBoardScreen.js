import React, {
  act,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  currentDesks,
  loadingSelector,
  onlineStateSelector,
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
  UpdateDeskPopUp,
} from '../../appComponents/appComponents';
import createDesk from '../../service/createDesk';
import {
  updateCurrentDesk,
  updateCurrentDesks,
} from '../../redux/slices/gameSlice';
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
  mergeLocalAndRemoteData,
  syncAllCards,
  syncAllDesks,
  syncCurrentCards,
  syncListCardsOfDesk,
} from '../../LocalDatabase/syncDBService';
import {Desk} from '../../LocalDatabase/model';
import {ActiveStatus, Card, MainGame} from '../../constants';
import {setUser} from '../../redux/slices/authSlice';
import {
  updateCardToRemote,
  updateDeskToRemote,
} from '../../service/postToRemote';
import {desk} from '../../LocalDatabase/dbQueries';
export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const data = useSelector(currentDesks);
  const navigation = useNavigation();
  const listCurrentDesks = useSelector(currentDesks);
  const actk = useSelector(accessTokenSelector);
  const loading = useSelector(loadingSelector);
  const [inputCreateDesk, setInputCreateDesk] = useState('');
  const [inputUpdateDesk, setInputUpdateDesk] = useState('');
  const [showCreateDesk, setShowCreateDesk] = useState(false);
  // Hold index of updated desk
  const [indexUpdatedDesk, setindexUpdatedDesk] = useState(undefined);
  const currentUser = useSelector(userSelector);
  const online = useSelector(onlineStateSelector);
  async function handleData(onlineState, accessToken) {
    console.log('[CHANGED]', accessToken);
    Promise.resolve()
      .then(() => {
        dispatch(setLoading(true));
      })
      // Fetch current user, update state, store local
      .then(async () => {
        if (onlineState) {
          const user = await fetchCurrentUser(accessToken, dispatch);
          if (user) {
            dispatch(setUser(user));
            // change to merge user
            await createNewUser(user);
            return user;
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      })
      // Fetch all Desks
      .then(async user => {
        if (user) {
          return await fetchListDesks(accessToken, user._id, dispatch);
        } else {
          return false;
        }
      })
      // Fetch all Cards
      .then(async listDesk => {
        if (listDesk) {
          const listAllRemoteCards = await fetchAllCards(
            dispatch,
            accessToken,
          ).catch(err => {
            console.log('Get all remote cards error with message:', err);
            console.log('Cannot connect to remote server!');
            return [];
          });
          const synchronizedListCards = await syncAllCards(listAllRemoteCards);
          await Promise.all(
            synchronizedListCards.map(card => {
              return Promise.all([
                updateCard(card),
                updateCardToRemote(accessToken, card),
              ]);
            }),
          );
          return listDesk;
        } else {
          console.log("Cannot connect to remote server! Let's use local");
          return [];
        }
      })
      // Get all current card and calculate, return list new desks
      .then(async listDesks => {
        let listMergedDesk = [];
        listMergedDesk = await syncAllDesks(listDesks);
        return await Promise.all(
          listMergedDesk.map(desk => {
            let news = 0;
            let inProgress = 0;
            let preview = 0;
            return getListCurrentCardsOfDesk(desk._id).then(
              async listCurrentCards => {
                listCurrentCards.forEach(card => {
                  if (card.active_status === ActiveStatus) {
                    if (card.status === 'new') {
                      news++;
                    } else if (card.status === 'inprogress') {
                      inProgress++;
                    } else {
                      preview++;
                    }
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
                  desk.new_card !== news ||
                  desk.inprogress_card !== inProgress ||
                  desk.preview_card !== preview
                    ? JSON.stringify(new Date())
                    : desk.modified_time,
                );
              },
            );
          }),
        );
      })
      // Receive List desk with total calculated cards, update new desk into local database
      .then(async listUpdatedDesks => {
        await Promise.all(
          listUpdatedDesks.map(desk => {
            return updateDesk(desk);
          }),
        );
        return listUpdatedDesks;
      })
      // Update list updated desks in state
      .then(listDesks => {
        dispatch(updateCurrentDesks(JSON.parse(JSON.stringify(listDesks))));
        return listDesks;
      })
      // Update list desk to mongoDB
      .then(listDesks => {
        dispatch(setLoading(false));
        if (online) {
          Promise.all(
            listDesks.map(desk => {
              return updateDeskToRemote(accessToken, desk);
            }),
          );
        }
      })
      .catch(err => {
        console.log('Handle data error with message:', err);
      });
  }
  useEffect(() => {
    console.log('ACCESS', actk);
    handleData(online, actk);
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
                id={item._id}
                title={item.title}
                primaryColor={item.primary_color}
                news={item.new_card}
                progress={item.inprogress_card}
                preview={item.preview_card}
                dispatch={() => {
                  dispatch(
                    updateCurrentDesks(
                      data.filter(deskDeleted => {
                        return deskDeleted._id != item._id;
                      }),
                    ),
                  );
                }}
                onClick={() => {
                  dispatch(updateCurrentDesk(item));
                  navigation.navigate(MainGame);
                }}
                onEdit={() => {
                  setindexUpdatedDesk(index);
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
              const id = uuid.v4();
              const newDesk = new Desk(
                id,
                user._id,
                inputCreateDesk,
                'black',
                0,
                0,
                0,
                JSON.stringify(new Date()).slice(1, -1),
                'active',
              );
              await createNewDesk(newDesk);
              dispatch(
                updateCurrentDesks([
                  ...listCurrentDesks,
                  JSON.parse(JSON.stringify(newDesk)),
                ]),
              );
              // await createDesk(inputCreateDesk, 'black', actk, data, dispatch);
              dispatch(setLoading(false));
              setShowCreateDesk(false);
            }}
          />
        </>
      ) : (
        <></>
      )}

      {indexUpdatedDesk === 0 || indexUpdatedDesk ? (
        <>
          <OverLay />
          <UpdateDeskPopUp
            input={inputUpdateDesk}
            setInput={setInputUpdateDesk}
            close={() => {
              setindexUpdatedDesk(undefined);
            }}
            update={async () => {
              dispatch(setLoading(true));
              const updatedDesk = new Desk(
                data[indexUpdatedDesk]._id,
                user._id,
                inputUpdateDesk,
                data[indexUpdatedDesk].primary_color,
                data[indexUpdatedDesk].new_card,
                data[indexUpdatedDesk].inprogress_card,
                data[indexUpdatedDesk].preview_card,
                JSON.stringify(new Date()).slice(1, -1),
              );
              await updateDesk(updatedDesk);
              dispatch(
                updateCurrentDesks(
                  data.map(desk => {
                    return desk._id !== updatedDesk._id
                      ? desk
                      : JSON.parse(JSON.stringify(updatedDesk));
                  }),
                ),
              );
              // await createDesk(inputCreateDesk, 'black', actk, data, dispatch);
              dispatch(setLoading(false));
              setindexUpdatedDesk(undefined);
            }}
            desk={listCurrentDesks[indexUpdatedDesk]}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  );
}
