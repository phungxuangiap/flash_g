import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useLayoutEffect, useState} from 'react';
import DeskBoardScreen from '../Screens/DeskBoard/DeskBoardScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SummaryScreen from '../Screens/Summary/SummaryScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import {getUser} from '../LocalDatabase/database';
import {useDispatch, useSelector} from 'react-redux';
import {userSelector} from '../redux/selectors';
import LoginScreen from '../Screens/Login/LoginScreen';
import RegisterScreen from '../Screens/Register/RegisterScreen';
import PendingScreen from '../Screens/Pending/PendingScreen';
import CardScreen from '../Screens/Card/CardScreen';
import {setUser} from '../redux/slices/authSlice';
import {
  Auth,
  BottomBar,
  Card,
  DeskBoard,
  Game,
  Login,
  MainGame,
  MainGameNavigator,
  Pending,
  Profile,
  Register,
  Summary,
} from '../constants';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './authNavigation';
import GameNavigator from './gameNavigation';
import BottomBarNavigator from './bottomBarNavigation';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
export default function MainNavigation() {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    getUser().then(userRes => {
      if (userRes) {
        dispatch(setUser(JSON.parse(JSON.stringify(userRes).slice(1, -1))));
      } else {
        dispatch(setUser(undefined));
      }
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Auth}>
        <Stack.Screen
          name={Auth}
          component={AuthNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={BottomBar}
          component={BottomBarNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={MainGame}
          component={GameNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
