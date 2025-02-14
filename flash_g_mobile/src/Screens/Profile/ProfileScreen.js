import {StyleSheet, Text, View} from 'react-native';
import {
  LoadingOverlay,
  WrapContentButton,
} from '../../appComponents/appComponents';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  accessTokenSelector,
  loadingSelector,
  onlineStateSelector,
} from '../../redux/selectors';
import {logout} from '../../service/logout';
import {store} from '../../redux/store';
import {setLoading} from '../../redux/slices/stateSlice';
import {Auth} from '../../constants';
import {handleLocalAndRemoteData} from '../../LocalDatabase/syncDBService';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector(loadingSelector);
  const accessToken = useSelector(accessTokenSelector);
  const onlineState = useSelector(onlineStateSelector);
  return (
    <View style={style.container}>
      <Text>Profile</Text>
      <WrapContentButton
        content={'Sign Out'}
        onClick={async () => {
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
        }}
      />
      {loading ? <LoadingOverlay /> : <></>}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
