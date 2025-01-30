import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SummaryScreen() {
  return (
    <View style={{padding: 24}}>
      <Text style={{fontSize: 36, color: 'black', fontWeight: 'bold'}}>
        Summary
      </Text>
      <View
        style={{
          backgroundColor: 'pink',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          borderRadius: 20,
          marginTop: 24,
          marginBottom: 24,
        }}>
        <Image
          style={{width: 150, height: 150}}
          source={require('../../assets/trophy.png')}
        />
        <Text style={{fontSize: 24, color: 'black', fontWeight: 'bold'}}>
          247 days streak
        </Text>
      </View>
      <Text
        style={{
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
          marginTop: 12,
          marginBottom: 12,
        }}>
        Overview
      </Text>
      <View style={{padding: 24, backgroundColor: 'pink', borderRadius: 20}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, textAlign: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24, color: 'black', fontWeight: 'bold'}}>
              342
            </Text>
            <Text>New</Text>
          </View>
          <View style={{flex: 1, textAlign: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24, color: 'black', fontWeight: 'bold'}}>
              27
            </Text>
            <Text>In Progress</Text>
          </View>
          <View style={{flex: 1, textAlign: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 24, color: 'black', fontWeight: 'bold'}}>
              12
            </Text>
            <Text>Preview</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {}}
          style={{alignSelf: 'center', paddingTop: 12}}>
          <Text style={{fontSize: 20}}>View Details</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 22,
          color: 'black',
          fontWeight: 'bold',
          marginTop: 12,
          marginBottom: 12,
        }}>
        Calendar
      </Text>
      <View
        style={{padding: 24, backgroundColor: 'pink', borderRadius: 20}}></View>
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
