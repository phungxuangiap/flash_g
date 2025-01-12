import {createContext, useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import React from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {getUser} from './src/LocalDatabase/database';
import {setDatabase, setOnline} from './src/redux/slices/stateSlice';
import MainNavigation from './src/navigation/mainNavigation';
import {setUser} from './src/redux/slices/authSlice';
import {onlineStateSelector, userSelector} from './src/redux/selectors';
import NetInfo from '@react-native-community/netinfo';
import {databaseInitialization} from './src/LocalDatabase/databaseInitialization';

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
        if (userRes && userRes[0].rows.item(0)) {
          dispatch(
            setUser(JSON.parse(JSON.stringify(userRes[0].rows.item(0)))),
          );
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
      console.log(state);
      if (state.isConnected) {
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
      <View style={{flex: 1}}>
        {user || doneLoad ? (
          <MainNavigation initialRoute={user ? 'bottombar' : 'Auth'} />
        ) : (
          <View style={{flex: 1, backgroundColor: 'blue'}}></View>
        )}
      </View>
    </LocalDatabaseContext.Provider>
  );
}
