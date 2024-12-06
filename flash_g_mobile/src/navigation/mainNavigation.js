import {
  createStaticNavigation,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DeskBoardScreen from '../Screens/DeskBoard/DeskBoardScreen';
import {AuthStack} from './authNavigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SummaryScreen from '../Screens/Summary/SummaryScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import {BottomBarStack} from './bottomBarNavigation';
//TODO: Fix it
const Stack = createNativeStackNavigator({
  initialRouteName: 'Auth',
  screens: {
    Auth: {
      screen: AuthStack,
      options: {
        headerShown: false,
      },
    },
    BottomBar: {
      screen: BottomBarStack,
      options: {
        headerShown: false,
      },
    },
  },
});
export const MainNavigation = createStaticNavigation(Stack);
