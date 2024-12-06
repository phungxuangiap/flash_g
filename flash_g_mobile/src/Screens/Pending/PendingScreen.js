import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function PendingScreen() {
  return (
    <View style={style.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
