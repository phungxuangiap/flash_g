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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={style.container}>
      <InputTag placeholder={'Email'} value={email} onValueChange={setEmail} />
      <InputTag
        placeholder={'Password'}
        value={password}
        onValueChange={setPassword}
      />
      <WrapContentButton content={'Login'} onClick={() => {}} />
      <ClickableText
        content={"Haven't had account yet? Register"}
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
