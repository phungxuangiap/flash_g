import {createContext, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import React from 'react';
import {Provider, useDispatch} from 'react-redux';
import {connectToDatabase, database} from './src/LocalDatabase/database';
import {setDatabase} from './src/redux/slices/stateSlice';
import {createTable} from './src/LocalDatabase/dbService';

const LocalDatabaseContext = createContext();
export function AppContainer({children}) {
  const dispatch = useDispatch();

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
      <View style={{flex: 1}}>{children}</View>
    </LocalDatabaseContext.Provider>
  );
}
