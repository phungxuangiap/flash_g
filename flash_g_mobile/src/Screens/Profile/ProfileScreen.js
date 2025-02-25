import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AvataBaseWordComponent,
  LoadingOverlay,
  MyCheckbox,
  WrapContentButton,
} from '../../appComponents/appComponents';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  loadingSelector,
  modeStateSelector,
  onlineStateSelector,
  restrictModeSelector,
  userSelector,
} from '../../redux/selectors';
import {logout} from '../../service/logout';
import {store} from '../../redux/store';
import {setLoading, setRestrictMode} from '../../redux/slices/stateSlice';
import {Auth, DarkMode, LightMode} from '../../constants';
import {handleLocalAndRemoteData} from '../../LocalDatabase/syncDBService';
import {
  back_dark,
  back_desk_dark,
  back_primary,
  icon_secondary,
  text_primary,
  text_primary_dark,
} from '../../assets/colors/colors';
import HeartIcon from '../../assets/icons/HeartIcon';
import PullIcon from '../../assets/icons/PullIcon';
import CommentIcon from '../../assets/icons/CommentIcon';
import CardsIcon from '../../assets/icons/CardsIcon';
import {UserPreference} from '../../LocalDatabase/model';
import {updateUserPreference} from '../../LocalDatabase/database';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector(loadingSelector);
  const accessToken = useSelector(accessTokenSelector);
  const onlineState = useSelector(onlineStateSelector);
  const mode = useSelector(modeStateSelector);
  const user = useSelector(userSelector);
  const restrictMode = useSelector(restrictModeSelector);
  console.log(restrictMode);
  return (
    <View
      style={{
        ...style.container,
        backgroundColor: mode === LightMode ? back_primary : back_dark,
      }}>
      <Text
        style={{
          fontSize: 36,
          color: mode === LightMode ? text_primary : text_primary_dark,
          fontWeight: 'bold',
        }}>
        Profile
      </Text>
      <ScrollView>
        <View
          style={{
            backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
            padding: 24,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24,
          }}>
          <View>
            <AvataBaseWordComponent
              full_name={user.full_name}
              customSize={70}
            />
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                color: mode === LightMode ? text_primary : text_primary_dark,
                fontWeight: 'bold',
                paddingTop: 6,
              }}>
              {user.full_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{padding: 24, paddingBottom: 0, alignItems: 'center'}}>
              <HeartIcon
                width={32}
                height={32}
                color={mode === LightMode ? 'black' : icon_secondary}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: mode === LightMode ? 'black' : icon_secondary,
                  paddingTop: 6,
                }}>
                1.2k
              </Text>
            </View>
            <View style={{padding: 24, alignItems: 'center', paddingBottom: 0}}>
              <PullIcon
                width={32}
                height={32}
                color={mode === LightMode ? 'black' : icon_secondary}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: mode === LightMode ? 'black' : icon_secondary,
                  paddingTop: 6,
                }}>
                1.2k
              </Text>
            </View>
            <View style={{padding: 24, alignItems: 'center', paddingBottom: 0}}>
              <CardsIcon
                width={32}
                height={32}
                color={mode === LightMode ? 'black' : icon_secondary}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: mode === LightMode ? 'black' : icon_secondary,
                  paddingTop: 6,
                }}>
                1.2k
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
            padding: 24,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 20,
              backgroundColor: mode === LightMode ? back_primary : back_dark,
              width: '100%',
              borderRadius: 20,
              marginBottom: 12,
              justifyContent: 'space-between',
            }}
            onPress={() => {
              dispatch(setRestrictMode(restrictMode ? 0 : 1));
            }}>
            <Text
              style={{color: mode === LightMode ? 'black' : icon_secondary}}>
              Restricted Mode
            </Text>
            <MyCheckbox
              checked={!!restrictMode}
              setChecked={() => {
                dispatch(setRestrictMode(restrictMode ? 0 : 1));
                const userPreference = new UserPreference(
                  1,
                  'blue',
                  'vietnam',
                  mode,
                  restrictMode ? 0 : 1,
                );
                updateUserPreference(userPreference);
              }}
              isLightMode={mode === LightMode}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 20,
              backgroundColor: mode === LightMode ? back_primary : back_dark,
              width: '100%',
              borderRadius: 20,
              marginBottom: 12,
            }}>
            <Text
              style={{color: mode === LightMode ? 'black' : icon_secondary}}>
              Change Full Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 20,
              backgroundColor: mode === LightMode ? back_primary : back_dark,
              width: '100%',
              borderRadius: 20,
              marginBottom: 12,
            }}>
            <Text
              style={{color: mode === LightMode ? 'black' : icon_secondary}}>
              Change Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 20,
              backgroundColor: mode === LightMode ? back_primary : back_dark,
              width: '100%',
              borderRadius: 20,
              marginBottom: 12,
            }}
            onPress={async () => {
              dispatch(setLoading(true));
              await handleLocalAndRemoteData(
                onlineState,
                accessToken,
                dispatch,
                navigation,
                true,
              ).then(res => {
                logout(accessToken);
              });
              // Reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{name: Auth}],
              });
              dispatch(setLoading(false));
            }}>
            <Text
              style={{color: mode === LightMode ? 'black' : icon_secondary}}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading ? <LoadingOverlay /> : <></>}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
