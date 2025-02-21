import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DeskBoard, LightMode, Profile, Social, Summary} from '../constants';
import DeskBoardScreen from '../Screens/DeskBoard/DeskBoardScreen';
import SummaryScreen from '../Screens/Summary/SummaryScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import {SocialScreen} from '../Screens/Social/SocialScreen';
import DeskBoardIcon from '../assets/icons/DeskBoardIcon';
import SocialIcon from '../assets/icons/SocialIcon';
import SummaryIcon from '../assets/icons/SummaryIcon';
import ProfileIcon from '../assets/icons/ProfileIcon';
import {
  back_desk_dark,
  icon_secondary,
  text_primary,
  text_primary_dark,
} from '../assets/colors/colors';
import {View} from 'react-native';
import {modeStateSelector} from '../redux/selectors';
import {store} from '../redux/store';
import {useSelector} from 'react-redux';

const BottomBarStack = createBottomTabNavigator();

export default function BottomBarNavigator() {
  const mode = useSelector(modeStateSelector);
  return (
    <BottomBarStack.Navigator
      initialRouteName={DeskBoard}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: mode === LightMode ? 'white' : back_desk_dark,
        },
        tabBarItemStyle: {
          padding: 12,
        },
      }}>
      <BottomBarStack.Screen
        name={DeskBoard}
        component={DeskBoardScreen}
        options={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View>
                <DeskBoardIcon
                  width={28}
                  height={28}
                  color={
                    focused
                      ? mode === LightMode
                        ? text_primary
                        : text_primary_dark
                      : icon_secondary
                  }
                />
              </View>
            );
          },
          tabBarShowLabel: false,
        })}
      />
      <BottomBarStack.Screen
        name={Social}
        component={SocialScreen}
        options={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            return (
              <SocialIcon
                width={28}
                height={28}
                color={
                  focused
                    ? mode === LightMode
                      ? text_primary
                      : text_primary_dark
                    : icon_secondary
                }
              />
            );
          },
          tabBarShowLabel: false,
        })}
      />
      <BottomBarStack.Screen
        name={Summary}
        component={SummaryScreen}
        options={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            return (
              <SummaryIcon
                width={28}
                height={28}
                color={
                  focused
                    ? mode === LightMode
                      ? text_primary
                      : text_primary_dark
                    : icon_secondary
                }
              />
            );
          },
          tabBarShowLabel: false,
        })}
      />
      <BottomBarStack.Screen
        name={Profile}
        component={ProfileScreen}
        options={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            return (
              <ProfileIcon
                width={28}
                height={28}
                color={
                  focused
                    ? mode === LightMode
                      ? text_primary
                      : text_primary_dark
                    : icon_secondary
                }
              />
            );
          },
          tabBarShowLabel: false,
        })}
      />
    </BottomBarStack.Navigator>
  );
}
