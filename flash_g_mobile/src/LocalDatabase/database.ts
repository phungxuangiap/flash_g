import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import SQLite from "react-native-sqlite-storage";
import { Desk, Card, User } from './model';
import { getLocalDatabase } from './databaseInitialization';
import { createNewCardQuery, createNewDeskQuery, createNewUserQuery, deleteCardQuery, deleteDeskQuery, getAllCardsQuery, getListCurrentCardsQuery, getListCurrentDesksQuery, updateCardQuery, updateDeskQuery } from './dbQueries';

// This file contains all services interacting with data in the local database
export interface Database {
  createNewDesk: (desk: Desk) => Promise<any>;
  updateDesk: (desk: Desk) => Promise<any>;
  deleteDesk: (deskId: string) => Promise<any>;
  getListCurrentDesks: () => Promise<any[]>;
  getListCurrentCards: (deskId: string) => Promise<any[]>;
  getAllCards: () => Promise<any[]>;
  createNewCard: (card: Card, desk_id:string) => Promise<any>;
  updateCard: (card: Card) => Promise<any>;
  deleteCard: (card_id: string) => Promise<any>;
  createNewUser: (user: User) => Promise<any>;
}

export async function createNewDesk(desk: Desk): Promise<any> {
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(createNewDeskQuery, [desk.id, desk.user_id, desk.title, desk.primary_color, desk.new_card, desk.inprogress_card, desk.preview_card]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK
export async function updateDesk(desk: Desk): Promise<any> {
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(updateDeskQuery, [desk.title, desk.primary_color, desk.new_card, desk.inprogress_card, desk.preview_card, desk.id]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function deleteDesk(deskId: string): Promise<any> {
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(deleteDeskQuery, [deskId]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function getListCurrentDesks(): Promise<any> {
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(getListCurrentDesksQuery);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function createNewCard(card: Card): Promise<any> {
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(createNewCardQuery, [card.id, card.desk_id, card.status, card.level, card.last_preview, card.vocab, card.description, card.sentence, card.vocab_audio, card.sentence_audio, card.type]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function getListCurrentCards(deskId:string): Promise<any> {
  const currentDate = new Date();
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(getListCurrentCardsQuery, [deskId, JSON.stringify(currentDate)]);
      
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function getAllCards(): Promise<any>{
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase)=>{
      return await db.executeSql(getAllCardsQuery);
    })
    .catch((error) => {
      console.log(error);
    });
} // OK

export async function updateCard(card: Card): Promise<any> {
  return getLocalDatabase()
    .then(async (db:SQLite.SQLiteDatabase) =>{
      await db.executeSql(updateCardQuery, [card.status, card.level, card.last_preview, card.vocab, card.description, card.sentence, card.vocab_audio, card.sentence_audio, card.type, card.id]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export async function deleteCard(cardId: string): Promise<any> {
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase)=>{
      await db.executeSql(deleteCardQuery, [cardId]);
    })
    .catch(error=>{
      console.log(error);
    });
} //OK

export async function createNewUser(user: User): Promise<any> {
  return getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(createNewUserQuery, [user.id, user.email, user.password, user.user_name]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK

export const database: Database = {
  createNewDesk,
  updateDesk,
  deleteDesk,
  getListCurrentDesks,
  getListCurrentCards,
  getAllCards,
  createNewCard,
  updateCard,
  deleteCard,
  createNewUser,
};
