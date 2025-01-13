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
  authStateSelector,
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
  deleteCard,
  deleteDesk,
  getAllCards,
  getListCurrentCardsOfDesk,
  getListDesks,
  getUser,
  updateCard,
  updateDesk,
} from '../../LocalDatabase/database';
import {
  handleLocalAndRemoteData,
  mergeLocalAndRemoteData,
  syncAllCards,
  syncAllDesks,
  syncCurrentCards,
  syncListCardsOfDesk,
} from '../../LocalDatabase/syncDBService';
import {Desk} from '../../LocalDatabase/model';
import {ActiveStatus, Card, DeletedStatus, MainGame} from '../../constants';
import {setUser} from '../../redux/slices/authSlice';
import {
  deleteCardInRemote,
  deleteDeskInRemote,
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
  const authState = useSelector(authStateSelector);
  // Hold index of updated desk
  const [indexUpdatedDesk, setindexUpdatedDesk] = useState(undefined);
  const currentUser = useSelector(userSelector);
  const online = useSelector(onlineStateSelector);
  const auth = useSelector(authStateSelector);
  useFocusEffect(
    useCallback(() => {
      handleLocalAndRemoteData(online, actk, dispatch);
    }, [actk, online, authState]),
  );
  return loading ? (
    <LoadingOverlay />
  ) : (
    <View style={{flex: 1, justifyContent: 'space-between', paddingBottom: 24}}>
      <ScrollView scrollEnabled={true}>
        {data &&
          data.map((item, index) => {
            if (item.active_status !== DeletedStatus) {
              return (
                <DeskComponent
                  key={uuid.v4()}
                  id={item._id}
                  title={item.title}
                  primaryColor={item.primary_color}
                  news={item.new_card}
                  progress={item.inprogress_card}
                  preview={item.preview_card}
                  onDelete={() => {
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
            }
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
