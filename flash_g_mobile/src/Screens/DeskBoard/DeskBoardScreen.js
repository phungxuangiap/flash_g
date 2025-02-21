import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  authStateSelector,
  currentDesks,
  imageStateSelector,
  loadingSelector,
  modeStateSelector,
  onlineStateSelector,
  userSelector,
} from '../../redux/selectors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {setImages, setLoading, setMode} from '../../redux/slices/stateSlice';
import uuid from 'react-native-uuid';
import {
  ButtonImage,
  CircleButton,
  CountryFlag,
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
import {
  AppPadding,
  DarkMode,
  DeletedStatus,
  LightMode,
  MainGame,
} from '../../constants';
import {Text} from '@react-navigation/elements';
import {
  deleteDeskInRemote,
  updateDeskToRemote,
} from '../../service/postToRemote';
import {addImageToCloudinary} from '../../service/imageService';
import {image} from '../../LocalDatabase/dbQueries';
import {
  back_dark,
  back_desk_dark,
  back_primary,
  icon_secondary,
  text_primary,
  text_primary_dark,
  text_secondary,
} from '../../assets/colors/colors';
import LightIcon from '../../assets/icons/LightIcon';
import NightIcon from '../../assets/icons/NightIcon';
import SearchIcon from '../../assets/icons/SearchIcon';

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
  const images = useSelector(imageStateSelector);
  const mode = useSelector(modeStateSelector);
  useFocusEffect(
    useCallback(() => {
      handleLocalAndRemoteData(online, actk, dispatch, navigation, false);
    }, [actk, online, authState]),
  );
  return (
    <View
      style={{
        flex: 1,
        padding: AppPadding,
        paddingBottom: 0,
        backgroundColor: mode === LightMode ? back_primary : back_dark,
        position: 'relative',
      }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: mode === LightMode ? text_primary : text_primary_dark,
          }}>
          Library
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <ButtonImage onPress={() => {}} style={{marginRight: 12}} /> */}
          <TouchableOpacity onPress={() => {}} style={{marginRight: 20}}>
            <SearchIcon
              color={mode === LightMode ? text_primary : text_primary_dark}
              width={36}
              height={36}
              borderColor={mode === LightMode ? 'black' : icon_secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setMode(mode === LightMode ? DarkMode : LightMode));
            }}>
            {mode === LightMode ? (
              <LightIcon width={36} height={36} color={'black'} />
            ) : (
              <NightIcon width={36} height={36} color={text_primary_dark} />
            )}
          </TouchableOpacity>
          {/* <CountryFlag onPress={() => {}} /> */}
        </View>
      </View>
      {/*List all your desk*/}
      <ScrollView>
        {/* Your Desks */}
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              paddingTop: 24,
              fontSize: 20,
              fontWeight: '900',
              color: mode === LightMode ? 'black' : icon_secondary,
            }}>
            Your Desks
          </Text>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            style={{marginLeft: -8, marginRight: -8}}>
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
                      remote_id={item.remote_id}
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
                        console.log(images[item.original_id]);
                        setInputUpdateDesk(item.title);
                        setDescriptionUpdateDesk(item.description);
                        setAccessStatusUpdateDesk(item.access_status);
                        setFileImage({uri: images[item.original_id]});
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
          <Text
            style={{
              paddingTop: 24,
              fontSize: 20,
              fontWeight: '900',
              color: mode === LightMode ? 'black' : icon_secondary,
            }}>
            Saved Desks
          </Text>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            style={{marginLeft: -8, marginRight: -8}}>
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
                      remote_id={item.remote_id}
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
                              return deskDeleted._id !== item._id;
                            }),
                          ),
                        );
                      }}
                      onClick={() => {
                        dispatch(updateCurrentDesk(item));
                        navigation.navigate(MainGame);
                      }}
                      onEdit={() => {}}
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
        isLightMode={mode === LightMode}
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
              if (fileImage) {
                const newImage = new Image(
                  uuid.v4(),
                  '',
                  '',
                  id,
                  fileImage.type,
                  fileImage.uri,
                  JSON.stringify(new Date()).slice(1, -1),
                );
                createNewImage(newImage);
                setFileImage(undefined);
                dispatch(
                  setImages({
                    ...images,
                    [id]: JSON.parse(JSON.stringify(newImage.img_url)),
                  }),
                );
              }
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
            isLightMode={mode === LightMode}
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
            fileImage={fileImage}
            setFileImage={setFileImage}
            close={() => {
              setFileImage(undefined);
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
              if (fileImage) {
                const newImage = new Image(
                  uuid.v4(),
                  '',
                  '',
                  data[indexUpdatedDesk]._id,
                  fileImage.type,
                  fileImage.uri,
                  JSON.stringify(new Date()).slice(1, -1),
                );
                createNewImage(newImage);
                setFileImage(undefined);
                dispatch(
                  setImages({
                    ...images,
                    [data[indexUpdatedDesk]._id]: JSON.parse(
                      JSON.stringify(newImage.img_url),
                    ),
                  }),
                );
              }
            }}
            desk={listCurrentDesks[indexUpdatedDesk]}
            isLightMode={mode === LightMode}
          />
        </>
      ) : (
        <></>
      )}
      {loading ? <LoadingOverlay /> : <></>}
    </View>
  );
}
