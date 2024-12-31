import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {View} from 'react-native';
import React from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {
  connectToDatabase,
  database,
  getUser,
} from './src/LocalDatabase/database';
import {setDatabase, setOnline} from './src/redux/slices/stateSlice';
import {createTable} from './src/LocalDatabase/dbService';
import MainNavigation from './src/navigation/mainNavigation';
import {setUser} from './src/redux/slices/authSlice';
import {onlineStateSelector, userSelector} from './src/redux/selectors';
import {Auth, BottomBar} from './src/constants';
import {LoadingOverlay} from './src/appComponents/appComponents';
import NetInfo from '@react-native-community/netinfo';

const LocalDatabaseContext = createContext();
export function AppContainer() {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const [doneLoad, setDoneLoad] = useState(false);
  const online = useSelector(onlineStateSelector);
  useLayoutEffect(() => {
    getUser().then(userRes => {
      if (userRes && userRes[0].rows.item(0)) {
        dispatch(setUser(JSON.parse(JSON.stringify(userRes[0].rows.item(0)))));
      } else {
        dispatch(setUser(undefined));
      }
      setDoneLoad(true);
    });
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        dispatch(setOnline(true));
        console.log('Connected');
      } else {
        dispatch(setOnline(false));
        console.log('Not connected.');
      }
    });
  }, []);
  const loadData = useCallback(async () => {
    try {
      // assign sqlite db
      const db = await connectToDatabase();
      await createTable(db);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <LocalDatabaseContext.Provider value={database}>
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
