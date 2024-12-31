import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DeskBoard, Profile, Summary} from '../constants';
import DeskBoardScreen from '../Screens/DeskBoard/DeskBoardScreen';
import SummaryScreen from '../Screens/Summary/SummaryScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';

const BottomBarStack = createBottomTabNavigator();

export default function BottomBarNavigator() {
  return (
    <BottomBarStack.Navigator
      initialRouteName={DeskBoard}
      screenOptions={{headerShown: false}}>
      <BottomBarStack.Screen name={DeskBoard} component={DeskBoardScreen} />
      <BottomBarStack.Screen name={Summary} component={SummaryScreen} />
      <BottomBarStack.Screen name={Profile} component={ProfileScreen} />
    </BottomBarStack.Navigator>
  );
}
