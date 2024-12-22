import {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {connectToDatabase} from './src/sqliteConfiguration/dbImpl';
import {setDatabase} from './src/redux/slices/stateSlice';
import {createTable} from './src/sqliteConfiguration/dbService';

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
  return <View style={{flex: 1}}>{children}</View>;
}
