/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from './src/redux/store';
import {AppContainer} from './AppContainer';
import {databaseInitialization} from './src/LocalDatabase/databaseInitialization';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
function Section({children, title}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
if (__DEV__) {
  const xhr = global.XMLHttpRequest;
  global.XMLHttpRequest = function (...args) {
    const xhrInstance = new xhr(...args);
    xhrInstance._open = xhrInstance.open;
    xhrInstance.open = function (method, url, ...rest) {
      console.log(`[Network Request]: ${method} ${url}`);
      return xhrInstance._open(method, url, ...rest);
    };
    return xhrInstance;
  };
}
const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
