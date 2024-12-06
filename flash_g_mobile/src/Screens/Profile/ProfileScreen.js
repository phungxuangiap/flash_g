import {StyleSheet, Text, View} from 'react-native';
import {WrapContentButton} from '../../appComponents/appComponents';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {accessTokenSelector} from '../../redux/selectors';
import {logout} from '../../service/logout';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const accessToken = useSelector(accessTokenSelector);
  return (
    <View style={style.container}>
      <Text>Profile</Text>
      <WrapContentButton
        content={'Sign Out'}
        onClick={() => {
          logout(accessToken);
          navigation.navigate('Auth');
        }}
      />
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
