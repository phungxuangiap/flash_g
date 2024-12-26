/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useCallback, useEffect} from 'react';
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
import {Card, Desk, User} from './src/LocalDatabase/model';
import {
  createNewCard,
  createNewDesk,
  createNewUser,
  deleteCard,
  deleteDesk,
  getAllCards,
  getListCurrentDesks,
  updateCard,
  updateDesk,
} from './src/LocalDatabase/database';
import {databaseInitialization} from './src/LocalDatabase/databaseInitialization';
import {
  createNewCardQuery,
  createNewDeskQuery,
  deleteDeskQuery,
  getAllCardsQuery,
  getListCurrentDesksQuery,
  updateDeskQuery,
} from './src/LocalDatabase/dbQueries';

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
  useEffect(() => {
    // Init local database.
    databaseInitialization()
      .then(async db => {
        await createNewCard(
          new Card(
            '1',
            '1',
            'DONE',
            0,
            JSON.stringify(new Date()),
            'vocab1',
            'desc1',
            'sentence1',
            'null',
            'null',
            'null',
          ),
        );
        return db;
      })
      .then(async db => {
        const data = await getAllCards();
        let listCards = [];
        data?.forEach(result => {
          for (let index = 0; index < result.rows.length; index++) {
            listCards.push(result.rows.item(index));
          }
        });
        console.log('[DATA]', listCards);
        return db;
      })
      .then(async db => {
        const results = await getListCurrentDesks();
        const listUser = [];
        results?.forEach(result => {
          for (let index = 0; index < result.rows.length; index++) {
            listUser.push(result.rows.item(index));
          }
        });
        console.log(listUser);
      });
  }, []);

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
