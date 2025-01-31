import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import SQLite from "react-native-sqlite-storage";
import { Desk, Card, User } from './model';
import { getLocalDatabase } from './databaseInitialization';
import { card, cleanAllCardQuery, cleanAllDeskQuery, cleanAllUserQuery, cleanUpQuery, createNewCardQuery, createNewDeskQuery, createNewUserQuery, deleteCardQuery, deleteDeskQuery, getAllCardsOfDeskQuery, getAllCardsQuery, getListCurrentCardsOfDeskQuery, getListCurrentCardsQuery, getListDesksQuery, getUserQuery, removeCardQuery, removeDeskQuery, updateCardQuery, updateDeskQuery } from './dbQueries';
import { store } from '../redux/store';

// This file contains all services interacting with data in the local database
export interface Database {
  createNewDesk: (desk: Desk) => Promise<any>;
  updateDesk: (desk: Desk) => Promise<any>;
  deleteDesk: (deskId: string) => Promise<any>;
  removeDesk: (deskId: string) => Promise<any>;
  getListDesks: () => Promise<any[]>;
  getListCurrentCardsOfDesk: (deskId: string) => Promise<any[]>;
  getListCurrentCards: () => Promise<any[]>;
  getAllCards: () => Promise<any[]>;
  createNewCard: (card: Card, desk_id:string) => Promise<any>;
  updateCard: (card: Card) => Promise<any>;
  deleteCard: (card_id: string) => Promise<any>;
  removeCard: (card_id: string) => Promise<any>;
  createNewUser: (user: User) => Promise<any>;
  getUser: ()=> Promise<any>;
  cleanUp: ()=> Promise<any>;
}

export async function createNewDesk(desk: Desk): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(createNewDeskQuery, [desk._id, desk.user_id, desk.author_id, desk.original_id, desk.access_status, desk.title, desk.description, desk.primary_color, desk.new_card, desk.inprogress_card, desk.preview_card, desk.modified_time]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK
export async function updateDesk(desk: Desk): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(updateDeskQuery, [desk._id, desk.user_id, desk.author_id, desk.original_id, desk.access_status, desk.title, desk.description, desk.primary_color, desk.new_card, desk.inprogress_card, desk.preview_card, desk.modified_time]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function deleteDesk(id: string): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(deleteDeskQuery, [id]);
    })
    .then(res=>{
      console.log("delete successfully")
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function getListDesks(): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(getListDesksQuery);
    })
    .catch((error) => {
      console.log("Get list desk in local got error with message:", error);
    });
} //OK

export async function createNewCard(card: Card): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(createNewCardQuery, [card._id, card.desk_id, card.user_id, card.author_id, card.original_id, card.status, card.level, card.last_preview, card.vocab, card.description, card.sentence, card.vocab_audio, card.sentence_audio, card.type, card.modified_time, card.active_status]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK


// Need to change query to simplify it
export async function getListCurrentCardsOfDesk(deskId:string): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(getAllCardsOfDeskQuery, [deskId])
        .then((res:any[])=>{
          let listAllCardsOfDesk: any[] = [];
          res?.forEach((item:any) => {
            for (let index = 0; index < item.rows.length; index++) {
              listAllCardsOfDesk.push(item.rows.item(index));
            }
          });
          listAllCardsOfDesk = listAllCardsOfDesk.filter((card:Card)=>{
            return checkIsCurrent(card.last_preview, card.level);
          });
          return listAllCardsOfDesk;
        });
      
    })
    .catch((error) => {
      console.log(error);
    });
} //OK
export async function getListCardsOfDesk(deskId:string): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(getAllCardsOfDeskQuery, [deskId])
        .then((res:any[])=>{
          let listAllCardsOfDesk: any[] = [];
          res?.forEach((item:any) => {
            for (let index = 0; index < item.rows.length; index++) {
              listAllCardsOfDesk.push(item.rows.item(index));
            }
          });
          return listAllCardsOfDesk;
        });
      
    })
    .catch((error) => {
      console.log(error);
    });
} //OK


export async function getListCurrentCards(): Promise<any[]> {
  return await getLocalDatabase()
    .then(async (db:SQLite.SQLiteDatabase)=>{
      return await db.executeSql(getListCurrentCardsQuery, [(JSON.stringify(new Date())).slice(1, -1)]);
    })
    .catch(err=>{
      console.log(err);
    });
}

export async function getAllCards(): Promise<any>{
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase)=>{
      return await db.executeSql(getAllCardsQuery, [store.getState().auth.user._id]);
    })
    .catch((error) => {
      console.log(error);
    });
} // OK

export async function updateCard(card: Card): Promise<any> {
  return await getLocalDatabase()
    .then(async (db:SQLite.SQLiteDatabase) =>{
      await db.executeSql(updateCardQuery, [card._id, card.desk_id, card.user_id, card.author_id, card.original_id, card.status, card.level, card.last_preview, card.vocab, card.description, card.sentence, card.vocab_audio, card.sentence_audio, card.type, card.modified_time, card.active_status]);
      console.log("Update card successfully")
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function deleteCard(cardId: string): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase)=>{
      await db.executeSql(deleteCardQuery, [(JSON.stringify(new Date()).slice(1, -1)), cardId]);
    })
    .catch(error=>{
      console.log(error);
    });
} //OK

export async function removeCard(cardId: string): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase)=>{
      await db.executeSql(removeCardQuery, [cardId]);
    })
    .catch(error=>{
      console.log("Remove card in local error with message:", error);
    })
}

export async function removeDesk(deskId: string): Promise<any> {
  return await getLocalDatabase()
    .then(async (db:SQLite.SQLiteDatabase) => {
      await db.executeSql(removeDeskQuery, [deskId]);
    })
    .catch(error=>{
      console.log("Remove desk error with message:", error);
    })
}

export async function createNewUser(user: User): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(createNewUserQuery, [user._id, user.email, user.password, user.user_name, (JSON.stringify(new Date())).slice(1, -1)]);
    })
    .catch((error) => {
      console.log('Create user in local error with message:', error, user);
    });
} //OK
export async function getUser(): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(getUserQuery);
      
    })
    .catch((error) => {
      console.log(error);
    });
} //OK
function checkIsCurrent(last_preview:string, level:number): boolean{
  const lastPreviewDate = Date.parse(last_preview);
  const currentDate = (new Date()).getTime();
  return lastPreviewDate + (Math.pow(2, level)-1) * 24 * 60 * 60 * 1000 <= currentDate;
}

export function cleanUp():Promise<any>{
  return getLocalDatabase()
    .then(async (db:SQLite.SQLiteDatabase)=>{
      await db.executeSql(cleanAllDeskQuery);
      return db;
    })
    .then(async (db:SQLite.SQLiteDatabase)=>{
      await db.executeSql(cleanAllUserQuery);
      return db;
    })
    .then(async (db:SQLite.SQLiteDatabase)=>{
      return await db.executeSql(cleanAllCardQuery);
    })
    .catch(err=>{
      console.log("Clean up local database error with message:", err);
    });
}



export const database: Database = {
  createNewDesk,
  updateDesk,
  deleteDesk,
  removeDesk,
  getListDesks,
  getListCurrentCardsOfDesk,
  getListCurrentCards,
  getAllCards,
  createNewCard,
  updateCard,
  deleteCard,
  removeCard,
  createNewUser,
  getUser,
  cleanUp,
};
