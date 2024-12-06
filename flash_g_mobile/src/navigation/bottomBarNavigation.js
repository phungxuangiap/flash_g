import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DeskBoardScreen from '../Screens/DeskBoard/DeskBoardScreen';
import SummaryScreen from '../Screens/Summary/SummaryScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';

export const BottomBarStack = createBottomTabNavigator({
  initialRouteName: 'Desk',
  screens: {
    Desk: DeskBoardScreen,
    Summary: SummaryScreen,
    Profile: ProfileScreen,
  },
});
