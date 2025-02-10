
import SQLite from "react-native-sqlite-storage";
import { card, createNewDeskQuery, desk, image, user, userPreferencesQuery } from "./dbQueries";
import { User } from "./model";


let databaseInstance: SQLite.SQLiteDatabase | undefined;



export async function getLocalDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (databaseInstance){
        return Promise.resolve(databaseInstance);
    }
    return openLocalDatabase();
}
export async function databaseInitialization() {
    return getLocalDatabase()
        .then(async (db: SQLite.SQLiteDatabase) => {
            await db.executeSql(desk);
            await db.executeSql(card);
            await db.executeSql(user);
            await db.executeSql(image);
            await db.executeSql(userPreferencesQuery);
            return db;
        })
        .catch((error) => {
            console.log(error);
        });
}
async function openLocalDatabase():Promise<SQLite.SQLiteDatabase> {
    SQLite.enablePromise(true);
    SQLite.DEBUG(true);
    if (databaseInstance){
        console.log('Local Database is already open !');
        return databaseInstance;
    }
    const db = await SQLite.openDatabase({name: 'flash_g.db', location: 'default'});
    console.log('Local Database is opened successfully !');
    databaseInstance = db;
    return db;
}

// Another sync functions to update remote database

