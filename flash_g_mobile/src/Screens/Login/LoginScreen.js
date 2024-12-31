import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
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
import {BottomBar, Register} from '../../constants';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const loadingState = useSelector(loadingSelector);
  const dispatch = useDispatch();

  return (
    <View style={style.container}>
      <InputTag placeholder={'Email'} value={email} onValueChange={setEmail} />
      <InputTag
        placeholder={'Password'}
        value={password}
        onValueChange={setPassword}
      />
      <WrapContentButton
        content={'Login'}
        onClick={() => {
          dispatch(setLoading(true));
          login(email, password)
            .then(accessToken => {
              console.log('Login successfully !');
              dispatch(changeAuth());
              dispatch(refreshAccessToken(accessToken));
              dispatch(setLoading(false));
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
