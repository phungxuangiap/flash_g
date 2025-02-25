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
import {StackActions, useNavigation} from '@react-navigation/native';
import {login} from '../../service/login';
import {useDispatch, useSelector} from 'react-redux';
import {loadingSelector} from '../../redux/selectors';
import {setLoading} from '../../redux/slices/stateSlice';
import {changeAuth, refreshAccessToken} from '../../redux/slices/authSlice';
import {BottomBar, LightMode, Login, Register} from '../../constants';
import {UserPreference} from '../../LocalDatabase/model';
import {updateUserPreference} from '../../LocalDatabase/database';
import {text_primary} from '../../assets/colors/colors';
import Logo from '../../assets/icons/Logo';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const loadingState = useSelector(loadingSelector);
  const dispatch = useDispatch();
  return (
    <View style={style.container}>
      <Text
        style={{
          fontSize: 24,
          color: text_primary,
          fontWeight: 'bold',
          paddingBottom: 24,
        }}>
        Login
      </Text>
      <InputTag
        placeholder={'Email'}
        value={email}
        onValueChange={setEmail}
        isLightMode={true}
      />
      <View style={{padding: 6}}></View>
      <InputTag
        placeholder={'Password'}
        value={password}
        onValueChange={setPassword}
        isLightMode={true}
      />
      <View style={{padding: 6}}></View>

      <WrapContentButton
        style={{
          backgroundColor: text_primary,
          borderRadius: 20,
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: 24,
          marginBottom: 6,
        }}
        content={'Login'}
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
          login(email, password)
            .then(accessToken => {
              console.log('Login successfully !');
              dispatch(changeAuth());
              dispatch(refreshAccessToken(accessToken));
              // dispatch(setLoading(false));
              navigation.navigate(BottomBar);
            })
            .catch(err => {
              Alert.alert('Email or Password is invalid', '');
              console.log('Login error with message:', err);
              dispatch(setLoading(false));
            });
        }}
      />
      <ClickableText
        content={"Haven't had account yet? Register"}
        onClick={() => {
          navigation.navigate(Register);
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
    position: 'relative',
  },
});
