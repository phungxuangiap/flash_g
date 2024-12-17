import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeData(key, data) {
  try {
    await AsyncStorage.setItem(key, data);
    console.log('Store data to local successfully');
  } catch (err) {
    console.log('Store data error with message:', err);
  }
}
export async function getData(key) {
  try {
    const data = await AsyncStorage.getItem(key);
    console.log('Get data from local successfully');
    return JSON.parse(data);
  } catch (err) {
    console.log('Get data error with message:', err);
  }
}
export async function clearData() {
  try {
    await AsyncStorage.clear();
    console.log('Clear all data successfully');
  } catch (err) {
    console.log('Clear all data error with message:', err);
  }
}
export async function removeData(key) {
  try {
    await AsyncStorage.remoteItem(key);
    console.log('Remove item successfully');
  } catch (err) {
    console.log(`Delete item of key ${key} error with message:`, err);
  }
}
