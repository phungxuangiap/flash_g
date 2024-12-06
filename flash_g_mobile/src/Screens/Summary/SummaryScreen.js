import {StyleSheet, Text, View} from 'react-native';

export default function SummaryScreen() {
  return (
    <View style={style.container}>
      <Text>Summary</Text>
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
