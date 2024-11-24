import {
  createStaticNavigation,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DeskBoardScreen from '../Screens/DeskBoard/DeskBoardScreen';
import {AuthStack} from './authNavigation';
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
    Desk: DeskBoardScreen,
  },
});
export const BottomBarNavigation = createStaticNavigation(Stack);
