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
  screens: {AuthStack},
});
export const Navigation = createStaticNavigation(Stack);
