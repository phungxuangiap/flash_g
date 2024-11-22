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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
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
      <WrapContentButton content={'Register'} onClick={() => {}} />
      <ClickableText
        content={'Already have account? Login'}
        onClick={() => {}}
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
