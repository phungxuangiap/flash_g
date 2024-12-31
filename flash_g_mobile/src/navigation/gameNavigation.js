import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Card, Game} from '../constants';
import CardScreen from '../Screens/Card/CardScreen';

const Stack = createNativeStackNavigator();
export default function GameNavigator() {
  return (
    <Stack.Navigator initialRouteName={Card}>
      <Stack.Screen name={Card} component={CardScreen} />
      <Stack.Screen name={Game} component={Game} />
    </Stack.Navigator>
  );
}
