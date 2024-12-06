import {
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
  WrapContentButton,
} from '../../appComponents/appComponents';
import {useNavigation} from '@react-navigation/native';
import {register} from '../../service/register';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const navigation = useNavigation();
  return (
    <View style={style.container}>
      <InputTag placeholder={'Email'} value={email} onValueChange={setEmail} />
      <InputTag
        placeholder={'User Name'}
        value={userName}
        onValueChange={setUserName}
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
          register(email, password, userName);
          navigation.navigate('BottomBar');
        }}
      />
      <ClickableText
        content={'Already have account? Login'}
        onClick={() => {
          navigation.navigate('Login');
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
