import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {LightMode} from '../../constants';
import {
  back_dark,
  back_primary,
  icon_secondary,
  text_primary,
  text_primary_dark,
} from '../../assets/colors/colors';
import {useSelector} from 'react-redux';
import {modeStateSelector} from '../../redux/selectors';

export default function SummaryScreen() {
  const mode = useSelector(modeStateSelector);
  return (
    <View
      style={{
        padding: 24,
        backgroundColor: mode === LightMode ? back_primary : back_dark,
        flex: 1,
      }}>
      <Text
        style={{
          fontSize: 36,
          color: mode == LightMode ? text_primary : text_primary_dark,
          fontWeight: 'bold',
        }}>
        Summary
      </Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: icon_secondary, fontSize: 18, fontWeight: 600}}>
          No service available.
        </Text>
      </View>
      {/* <View
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
          source={require('../../assets/images/trophy.png')}
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
        style={{padding: 24, backgroundColor: 'pink', borderRadius: 20}}></View> */}
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
