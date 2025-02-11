import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  authStateSelector,
  currentDesks,
  loadingSelector,
  onlineStateSelector,
  userSelector,
} from '../../redux/selectors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Alert, ScrollView, View} from 'react-native';
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
import {
  updateCurrentDesk,
  updateCurrentDesks,
} from '../../redux/slices/gameSlice';
import {
  createNewDesk,
  createNewImage,
  updateDesk,
} from '../../LocalDatabase/database';
import {handleLocalAndRemoteData} from '../../LocalDatabase/syncDBService';
import {Desk, Image} from '../../LocalDatabase/model';
import {DeletedStatus, MainGame} from '../../constants';
import {Text} from '@react-navigation/elements';
import {
  deleteDeskInRemote,
  updateDeskToRemote,
} from '../../service/postToRemote';
import {addImageToCloudinary} from '../../service/imageService';

export default function DeskBoardScreen() {
  const dispatch = useDispatch();
  //
  const user = useSelector(userSelector);
  const data = useSelector(currentDesks);
  const navigation = useNavigation();
  const listCurrentDesks = useSelector(currentDesks);
  const actk = useSelector(accessTokenSelector);
  const loading = useSelector(loadingSelector);
  //input
  const [inputCreateDesk, setInputCreateDesk] = useState('');
  const [inputUpdateDesk, setInputUpdateDesk] = useState('');
  const [descriptionCreateDesk, setDescriptionCreateDesk] = useState('');
  const [descriptionUpdateDesk, setDescriptionUpdateDesk] = useState('');
  const [accessStatusUpdateDesk, setAccessStatusUpdateDesk] =
    useState('PUBLIC');
  const [fileImage, setFileImage] = useState(undefined);
  const [accessStatus, setAccessStatus] = useState('PUBLIC');
  const [primaryColorInp, setPrimaryColorInp] = useState('pink');

  //show ui
  const [showCreateDesk, setShowCreateDesk] = useState(false);
  // auth state
  const authState = useSelector(authStateSelector);
  // Hold index of updated desk
  const [indexUpdatedDesk, setindexUpdatedDesk] = useState(undefined);
  const currentUser = useSelector(userSelector);
  const online = useSelector(onlineStateSelector);
  const auth = useSelector(authStateSelector);
  useFocusEffect(
    useCallback(() => {
      handleLocalAndRemoteData(online, actk, dispatch, navigation);
    }, [actk, online, authState]),
  );
  return loading ? (
    <LoadingOverlay />
  ) : (
    <View
      style={{
        flex: 1,
        paddingBottom: 24,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 24,
      }}>
      {/* Header */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 36, fontWeight: 'bold'}}>Library</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Search</Text>
          <Text>Flag</Text>
        </View>
      </View>
      {/*List all your desk*/}
      <ScrollView>
        {/* Your Desks */}
        <View style={{flexDirection: 'column'}}>
          <Text style={{paddingTop: 24, fontSize: 18, fontWeight: 'bold'}}>
            Your Desks
          </Text>
          <ScrollView horizontal={true} scrollEnabled={true}>
            {data &&
              data.map((item, index) => {
                if (
                  item.active_status !== DeletedStatus &&
                  item.author_id === item.user_id
                ) {
                  return (
                    <DeskComponent
                      key={uuid.v4()}
                      id={item._id}
                      original_id={item.original_id}
                      user={user}
                      title={item.title}
                      primaryColor={item.primary_color}
                      news={item.new_card}
                      progress={item.inprogress_card}
                      preview={item.preview_card}
                      onDelete={() => {
                        dispatch(
                          updateCurrentDesks(
                            data.filter(deskDeleted => {
                              return deskDeleted._id !== item._id;
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
        </View>
        {/* Your Saved Desks */}
        <View style={{flexDirection: 'column'}}>
          <Text style={{paddingTop: 24, fontSize: 18, fontWeight: 'bold'}}>
            Saved Desks
          </Text>
          <ScrollView horizontal={true} scrollEnabled={true}>
            {data &&
              data.map((item, index) => {
                if (
                  item.active_status !== DeletedStatus &&
                  item.author_id !== item.user_id
                ) {
                  return (
                    <DeskComponent
                      key={uuid.v4()}
                      id={item._id}
                      original_id={item.original_id}
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
        </View>
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
            description={descriptionCreateDesk}
            setDescription={setDescriptionCreateDesk}
            primaryColor={primaryColorInp}
            setPrimaryColor={setPrimaryColorInp}
            fileImage={fileImage}
            setFileImage={setFileImage}
            accessStatus={accessStatus}
            setAccessStatus={setAccessStatus}
            close={() => {
              setShowCreateDesk(preState => !preState);
            }}
            create={async () => {
              dispatch(setLoading(true));
              const id = uuid.v4();
              const newDesk = new Desk(
                id,
                user._id,
                user._id,
                id,
                accessStatus,
                inputCreateDesk,
                descriptionCreateDesk,
                primaryColorInp,
                0,
                0,
                0,
                JSON.stringify(new Date()).slice(1, -1),
                'active',
              );
              console.log(fileImage, 'FILEIMAGE');
              if (fileImage) {
                const newImage = new Image(
                  uuid.v4(),
                  newDesk._id,
                  JSON.stringify(fileImage),
                  JSON.stringify(new Date()).slice(1, -1),
                );
                createNewImage(newImage);
              }
              await createNewDesk(newDesk);
              // const img_link = await addImageToCloudinary(file, actk);
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
            description={descriptionUpdateDesk}
            setDescription={setDescriptionUpdateDesk}
            accessStatus={accessStatusUpdateDesk}
            setAccessStatus={setAccessStatusUpdateDesk}
            close={() => {
              setindexUpdatedDesk(undefined);
            }}
            update={async () => {
              dispatch(setLoading(true));
              const updatedDesk = new Desk(
                data[indexUpdatedDesk]._id,
                user._id,
                data[indexUpdatedDesk].author_id,
                data[indexUpdatedDesk].original_id,
                accessStatusUpdateDesk,
                inputUpdateDesk,
                descriptionUpdateDesk,
                data[indexUpdatedDesk].primary_color,
                data[indexUpdatedDesk].new_card,
                data[indexUpdatedDesk].inprogress_card,
                data[indexUpdatedDesk].preview_card,
                JSON.stringify(new Date()).slice(1, -1),
                data[indexUpdatedDesk].active_status,
                data[indexUpdatedDesk].remote_id,
              );
              await updateDesk(updatedDesk)
                .then(res => {
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
                })
                .catch(err => {
                  Alert.alert('Update Desk Fail with error:', err);
                });
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
