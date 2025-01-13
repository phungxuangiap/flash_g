import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomBar, Card, DeskBoard, Game} from '../constants';
import CardScreen from '../Screens/Card/CardScreen';
import {HeaderBackButton} from '@react-navigation/elements';
import React from 'react';
import GameComponent from '../Screens/Game/MainGame';

const Stack = createNativeStackNavigator();
export default function GameNavigator() {
  return (
    <Stack.Navigator initialRouteName={Card}>
      <Stack.Screen
        name={Card}
        component={CardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Game}
        component={GameComponent}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
