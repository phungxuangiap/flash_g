import {card, desk, user, userPreferencesQuery} from './model';

export const createTable = async db => {
  try {
    await db.executeSql(userPreferencesQuery);
    await db.executeSql(user);
    await db.executeSql(desk);
    await db.executeSql(card);
  } catch (e) {
    console.log(e);
  }
};
