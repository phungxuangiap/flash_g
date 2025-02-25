import {createContext, useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import React from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {getUser} from './src/LocalDatabase/database';
import {
  setDatabase,
  setLoading,
  setOnline,
} from './src/redux/slices/stateSlice';
import MainNavigation from './src/navigation/mainNavigation';
import {setUser} from './src/redux/slices/authSlice';
import {onlineStateSelector, userSelector} from './src/redux/selectors';
import NetInfo from '@react-native-community/netinfo';
import {databaseInitialization} from './src/LocalDatabase/databaseInitialization';
import networkSpeed from 'react-native-network-speed';
import {LoadingOverlay} from './src/appComponents/appComponents';

const LocalDatabaseContext = createContext();
export function AppContainer() {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const [doneLoad, setDoneLoad] = useState(false);
  const database = useRef();

  const loadData = useCallback(async () => {
    try {
      // assign sqlite db
      database.current = await databaseInitialization();
      getUser().then(userRes => {
        if (userRes) {
          dispatch(setUser(JSON.parse(JSON.stringify(userRes))));
          dispatch(setLoading(true));
        } else {
          dispatch(setUser(undefined));
        }
        setDoneLoad(true);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (
        state.isConnected &&
        state.details.txLinkSpeed >= 1 &&
        state.details.rxLinkSpeed >= 1
      ) {
        dispatch(setOnline(true));
        console.log('Connected');
      } else {
        dispatch(setOnline(false));
        console.log('Not connected.');
      }
    });
  }, []);
  useEffect(() => {
    loadData();
  }, []);

  return (
    <LocalDatabaseContext.Provider value={database.current}>
      <View style={{flex: 1, position: 'relative'}}>
        {user || doneLoad ? (
          <MainNavigation initialRoute={user ? 'bottombar' : 'Auth'} />
        ) : (
          <LoadingOverlay />
        )}
      </View>
    </LocalDatabaseContext.Provider>
  );
}
