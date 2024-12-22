/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './src/Screens/Login/LoginScreen';
import RegisterScreen from './src/Screens/Register/RegisterScreen';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {
  BottomBarNavigation,
  MainNavigation,
} from './src/navigation/mainNavigation';
import {AppContainer} from './AppContainer';

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
function App() {
  // To see all the requests in the chrome Dev tools in the network tab.

  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <Provider store={store}>
      <AppContainer>
        <MainNavigation />
      </AppContainer>
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
