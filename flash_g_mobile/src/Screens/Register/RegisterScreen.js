import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ClickableText,
  InputTag,
  LoadingOverlay,
  WrapContentButton,
} from '../../appComponents/appComponents';
import {useNavigation} from '@react-navigation/native';
import {register} from '../../service/register';
import {useDispatch, useSelector} from 'react-redux';
import {changeAuth, refreshAccessToken} from '../../redux/slices/authSlice';
import {setLoading} from '../../redux/slices/stateSlice';
import {loadingSelector} from '../../redux/selectors';
import {BottomBar, LightMode, Login} from '../../constants';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {updateUserPreference} from '../../LocalDatabase/database';
import {UserPreference} from '../../LocalDatabase/model';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const loadingState = useSelector(loadingSelector);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <View style={style.container}>
      <InputTag placeholder={'Email'} value={email} onValueChange={setEmail} />
      <InputTag
        placeholder={'User Name'}
        value={userName}
        onValueChange={setUserName}
      />
      <InputTag
        placeholder={'Full name'}
        value={fullName}
        onValueChange={setFullName}
      />
      <InputTag
        placeholder={'Password'}
        value={password}
        onValueChange={setPassword}
      />
      <InputTag
        placeholder={'Retype Password'}
        value={retypePassword}
        onValueChange={setRetypePassword}
      />
      <WrapContentButton
        content={'Register'}
        onClick={() => {
          dispatch(setLoading(true));
          const userPreference = new UserPreference(
            1,
            'blue',
            'vietnam',
            LightMode,
            0,
          );
          updateUserPreference(userPreference);
          register(email, password, userName, fullName)
            .then(accessToken => {
              dispatch(refreshAccessToken(accessToken));
              dispatch(changeAuth());
              dispatch(setLoading(false));
              navigation.navigate(BottomBar);
            })
            .catch(err => {
              Alert.alert('Email is already used!');
              console.log(err);
              dispatch(setLoading(false));
            });
        }}
      />
      <ClickableText
        content={'Already have account? Login'}
        onClick={() => {
          navigation.navigate(Login);
        }}
      />
      {loadingState ? <LoadingOverlay /> : <></>}
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
