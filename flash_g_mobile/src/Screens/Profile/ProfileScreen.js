import {StyleSheet, Text, View} from 'react-native';
import {
  LoadingOverlay,
  WrapContentButton,
} from '../../appComponents/appComponents';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {accessTokenSelector, loadingSelector} from '../../redux/selectors';
import {logout} from '../../service/logout';
import {store} from '../../redux/store';
import {setLoading} from '../../redux/slices/stateSlice';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector(loadingSelector);
  const accessToken = useSelector(accessTokenSelector);
  return (
    <View style={style.container}>
      <Text>Profile</Text>
      <WrapContentButton
        content={'Sign Out'}
        onClick={async () => {
          dispatch(setLoading(true));

          await logout(accessToken);
          dispatch(setLoading(false));
          navigation.navigate('Auth');
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
