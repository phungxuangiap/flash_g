import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterScreen from '../Screens/Register/RegisterScreen';
import {createStaticNavigation} from '@react-navigation/native';
import React from 'react';
import PendingScreen from '../Screens/Pending/PendingScreen';
import CardScreen from '../Screens/Card/CardScreen';
import MainGame from '../Screens/Game/MainGame';

export const PlaygroundStack = createNativeStackNavigator({
  initialRouteName: 'Card',
  screens: {
    Card: {
      screen: CardScreen,
      options: {
        headerShown: false,
      },
    },
    MainGame: {
      screen: MainGame,
      options: {
        headerShown: false,
      },
    },
  },
});
