import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, Pending, Register} from '../constants';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterScreen from '../Screens/Register/RegisterScreen';
import PendingScreen from '../Screens/Pending/PendingScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName={Login}>
      <Stack.Screen name={Login} component={LoginScreen} />
      <Stack.Screen name={Register} component={RegisterScreen} />
      <Stack.Screen name={Pending} component={PendingScreen} />
    </Stack.Navigator>
  );
}
