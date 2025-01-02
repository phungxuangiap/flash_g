import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomBar, Card, Game} from '../constants';
import CardScreen from '../Screens/Card/CardScreen';
import {HeaderBackButton} from '@react-navigation/elements';

const Stack = createNativeStackNavigator();
export default function GameNavigator() {
  return (
    <Stack.Navigator initialRouteName={Card}>
      <Stack.Screen
        name={Card}
        component={CardScreen}
        options={({navigation, route}) => ({
          headerLeft: props => (
            <HeaderBackButton
              {...props}
              onPress={() => navigation.navigate(BottomBar)}
            />
          ),
        })}
      />
      <Stack.Screen name={Game} component={Game} />
    </Stack.Navigator>
  );
}
