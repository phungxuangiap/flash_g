import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterScreen from '../Screens/Register/RegisterScreen';
import {createStaticNavigation} from '@react-navigation/native';
import React from 'react';
import PendingScreen from '../Screens/Pending/PendingScreen';

export const AuthStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Login: {
      screen: LoginScreen,
      options: {
        title: 'Login',
      },
    },
    Register: RegisterScreen,
    Pending: PendingScreen,
  },
});
