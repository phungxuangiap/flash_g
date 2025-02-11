import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import SQLite from "react-native-sqlite-storage";
import { Desk, Card, User, Image } from './model';
import { getLocalDatabase } from './databaseInitialization';
import { card, cleanAllCardQuery, cleanAllDeskQuery, cleanAllUserQuery, cleanUpQuery, createNewCardQuery, createNewDeskQuery, createNewImageQuery, createNewUserQuery, deleteCardQuery, deleteDeskQuery, deleteImageQuery, getAllCardsOfDeskQuery, getAllCardsQuery, getAllDesksQuery, getAllImageQuery, getDeskQuery, getImageQuery, getListCurrentCardsQuery, getListDesksQuery, getUserQuery, removeCardQuery, removeDeskQuery, updateCardQuery, updateDeskQuery, updateImageQuery } from './dbQueries';
import { store } from '../redux/store';
import { original } from '@reduxjs/toolkit';

// This file contains all services interacting with data in the local database
export interface Database {
  createNewDesk: (desk: Desk) => Promise<any>;
  updateDesk: (desk: Desk) => Promise<any>;
  deleteDesk: (deskId: string) => Promise<any>;
  removeDesk: (deskId: string) => Promise<any>;
  getListDesks: () => Promise<any[]>;
  getAllCurrentCardsOfDesk: (deskId: string) => Promise<any[]>;
  getListCurrentCards: () => Promise<any[]>;
  getAllCards: () => Promise<any[]>;
  getAllDesks: () => Promise<any[]>;
  getDesk: (deskId: string)=> Promise<any>;
  createNewCard: (card: Card, desk_id:string) => Promise<any>;
  updateCard: (card: Card) => Promise<any>;
  deleteCard: (card_id: string) => Promise<any>;
  removeCard: (card_id: string) => Promise<any>;
  createNewUser: (user: User) => Promise<any>;
  getUser: ()=> Promise<any>;
  cleanUp: ()=> Promise<any>;
  createNewImage: (image:Image)=>Promise<any>;
  getImageOfDesk: (original_id: string)=>Promise<any>;
  updateImage: (image:Image)=>Promise<any>;
  deleteImage: (original_id:string)=>Promise<any>;
  getAllLocalImage: ()=>Promise<any>;

}

export async function createNewDesk(desk: Desk): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(createNewDeskQuery, [desk._id, desk.user_id, desk.author_id, desk.original_id, desk.access_status, desk.title, desk.description, desk.primary_color, desk.new_card, desk.inprogress_card, desk.preview_card, desk.modified_time, desk.remote_id, desk.active_status]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK
export async function updateDesk(desk: Desk): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(updateDeskQuery, [desk._id, desk.user_id, desk.author_id, desk.original_id, desk.access_status, desk.title, desk.description, desk.primary_color, desk.new_card, desk.inprogress_card, desk.preview_card, desk.modified_time, desk.remote_id, desk.active_status]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK
export async function getDesk(desk_id: string): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      return await db.executeSql(getAllDesksQuery, [desk_id]).then((res:any)=>{
        let listDesk: any[] = [];
        res?.forEach((result:any) => {
          for (let index = 0; index < result.rows.length; index++) {
              listDesk.push(result.rows.item(index));
          }
        });
        return listDesk[0]?listDesk[0]:undefined;
      });
    })
    .catch((error) => {
      console.log("Get desk in local got error with message:", error);
    });
}


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

export async function getAllDesks(): Promise<any>{
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase)=>{
      return await db.executeSql(getAllDesksQuery, [store.getState().auth.user._id]).then((res:any)=>{
        let listDesk: any[] = [];
        res?.forEach((result:any) => {
          for (let index = 0; index < result.rows.length; index++) {
              listDesk.push(result.rows.item(index));
          }
        });
        return listDesk;
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function createNewCard(card: Card): Promise<any> {
  return await getLocalDatabase()
    .then(async (db: SQLite.SQLiteDatabase) => {
      await db.executeSql(createNewCardQuery, [card._id, card.desk_id, card.user_id, card.author_id, card.original_id, card.status, card.level, card.last_preview, card.vocab, card.description, card.sentence, card.vocab_audio, card.sentence_audio, card.type, card.modified_time, card.active_status, card.remote_id]);
    })
    .catch((error) => {
      console.log(error);
    });
} //OK


// Need to change query to simplify it
export async function getAllCurrentCardsOfDesk(deskId:string): Promise<any> {
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
          listAllCardsOfDesk = listAllCardsOfDesk.filter((currentCard : Card)=>{
            return checkIsCurrent(currentCard.last_preview, currentCard.level);
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
      return await db.executeSql(getAllCardsQuery, [store.getState().auth.user._id]).then((response:any)=>{
        let listAllLocakCards:any[] = [];
        response?.forEach((result:any) => {
          for (let index = 0; index < result.rows.length; index++) {
              listAllLocakCards.push(result.rows.item(index));
          }
        });
        return listAllLocakCards;
      });
    })
    .catch((error) => {
      console.log(error);
    });
} // OK

export async function updateCard(card: Card): Promise<any> {
  return await getLocalDatabase()
    .then(async (db:SQLite.SQLiteDatabase) =>{
      await db.executeSql(updateCardQuery, [card._id, card.desk_id, card.user_id, card.author_id, card.original_id, card.status, card.level, card.last_preview, card.vocab, card.description, card.sentence, card.vocab_audio, card.sentence_audio, card.type, card.modified_time, card.active_status, card.remote_id]);
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
      return await db.executeSql(getUserQuery)
        .then((user:any)=>{
          let userFiltered:any[] = [];
          user?.forEach((result:any) => {
            for (let index = 0; index < result.rows.length; index++) {
                userFiltered.push(result.rows.item(index));
            }
          });
          return userFiltered[0] ? userFiltered[0] : undefined;});
    })
    .catch((error:any) => {
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


export function createNewImage(image:Image):Promise<any>{
  return getLocalDatabase()
    .then(async (db:SQLite.SQLiteDatabase)=>{
      return await db.executeSql(createNewImageQuery, [image._id, image.desk_id, image.file, image.modified_time]);
    })
    .catch(err=>{
      console.log("Create new Image at local error with message:", err);
    });
}

export function getImageOfDesk(original_id: string){
  return getLocalDatabase()
    .then(async(db: SQLite.SQLiteDatabase)=>{
      const response = await db.executeSql(getImageQuery, [original_id]);
      let listLocalImageOfDesk: any[] = [];
          response?.forEach((item:any) => {
            for (let index = 0; index < item.rows.length; index++) {
              listLocalImageOfDesk.push(item.rows.item(index));
            }
          });
          return listLocalImageOfDesk;
    })
    .catch(err=>{
      console.log("Get Image of desk error with message:", err);
    });
}

export function updateImage(image:Image){
  return getLocalDatabase()
    .then(async(db:SQLite.SQLiteDatabase)=>{
      return await db.executeSql(updateImageQuery, [image._id, image.desk_id, image.file, image.modified_time]);
    })
    .catch(err=>{
      console.log("Update Image error with message:", err);
    });
}

export function deleteImage(original_id: string){
  return getLocalDatabase()
    .then(async(db:SQLite.SQLiteDatabase)=>{
      return await db.executeSql(deleteImageQuery, [original_id]);
    })
    .catch(err=>{
      console.log("Delete image error with message:", err);
    });
}


export function getAllLocalImage(){
  return getLocalDatabase()
    .then(async(db:SQLite.SQLiteDatabase)=>{
      const response = await db.executeSql(getAllImageQuery);
      let listLocalImageOfDesk: any[] = [];
          response?.forEach((item:any) => {
            for (let index = 0; index < item.rows.length; index++) {
              listLocalImageOfDesk.push(item.rows.item(index));
            }
          });
          return listLocalImageOfDesk;
    });
}
export const database: Database = {
  createNewDesk,
  updateDesk,
  deleteDesk,
  removeDesk,
  getListDesks,
  getAllCurrentCardsOfDesk,
  getListCurrentCards,
  getAllCards,
  getAllDesks,
  getDesk,
  createNewCard,
  updateCard,
  deleteCard,
  removeCard,
  createNewUser,
  getUser,
  cleanUp,
  createNewImage,
  getImageOfDesk,
  updateImage,
  deleteImage,
  getAllLocalImage,
};
