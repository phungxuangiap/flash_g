
import { useDispatch } from "react-redux";
import { ActiveStatus, DeletedStatus } from "../constants";
import { setUser } from "../redux/slices/authSlice";
import { updateCurrentDesks } from "../redux/slices/gameSlice";
import { setLoading } from "../redux/slices/stateSlice";
import { fetchAllCards, fetchCurrentUser, fetchListDesks } from "../service/fetchRemoteData";
import { deleteCardInRemote, deleteDeskInRemote, updateCardToRemote, updateDeskToRemote } from "../service/postToRemote";
import { createNewUser, deleteCard, deleteDesk, getAllCards, getListCurrentCards, getListCurrentCardsOfDesk, getListDesks, updateCard, updateDesk } from "./database";
import { Desk } from "./model";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
export async function handleLocalAndRemoteData(onlineState:boolean, accessToken:string, dispatch:Dispatch<UnknownAction>){
    return await Promise.resolve()
          .then(() => {
            dispatch(setLoading(true));
          })
          // Fetch current user, update state, store local
          .then(async () => {
            if (onlineState) {
              const user = await fetchCurrentUser(accessToken, dispatch);
              if (user) {
                dispatch(setUser(user));
                // change to merge user
                await createNewUser(user);
                return user;
              } else {
                return undefined;
              }
            } else {
              return undefined;
            }
          })
          // Fetch all Desks
          .then(async user => {
            if (user) {
              return await fetchListDesks(accessToken, user._id, dispatch);
            } else {
              return false;
            }
          })
          // Fetch all Cards
          // TODO: Optimize call PUT request, just call when modified time of card is different with the old one
          .then(async listDesk => {
            if (listDesk) {
              const listAllRemoteCards = await fetchAllCards(
                dispatch,
                accessToken,
              ).catch(err => {
                console.log('Get all remote cards error with message:', err);
                console.log('Cannot connect to remote server!');
                return [];
              });
              const synchronizedListCards = await syncAllCards(listAllRemoteCards);
              const testCompareList = compareListActiveDataInLocalWithRemote(synchronizedListCards, listAllRemoteCards);
              console.log('[TESTCOMPARE]', testCompareList);
              await Promise.all(
                testCompareList.map(card => {
                  return Promise.all(
                    card.active_status === DeletedStatus
                      ? [
                          deleteCard(card._id),
                          deleteCardInRemote(accessToken, card),
                        ]
                      : [updateCard(card), updateCardToRemote(accessToken, card)],
                  );
                }),
              );
              return listDesk;
            } else {
              console.log("Cannot connect to remote server! Let's use local");
              return [];
            }
          })
          // Get all current card and calculate, return list new desks
          .then(async (listDesks) => {
            let listMergedDesk = [];
            listMergedDesk = await syncAllDesks(listDesks);
    
            return await Promise.all(
              listMergedDesk.map((desk:any) => {
                let news = 0;
                let inProgress = 0;
                let preview = 0;
    
                return getListCurrentCardsOfDesk(desk._id).then(
                  async listCurrentCards => {
                    listCurrentCards.forEach((card:any) => {
                      if (card.active_status === ActiveStatus) {
                        if (card.status === 'new') {
                          news++;
                        } else if (card.status === 'inprogress') {
                          inProgress++;
                        } else {
                          preview++;
                        }
                      }
                    });
                    return new Desk(
                      desk._id,
                      desk.user_id,
                      desk.title,
                      desk.primary_color,
    
                      news,
                      inProgress,
                      preview,
                      desk.new_card !== news ||
                      desk.inprogress_card !== inProgress ||
                      desk.preview_card !== preview
                        ? JSON.stringify(new Date())
                        : desk.modified_time,
                      desk.active_status,
                    );
                  },
                );
              }),
            );
          })
          // Receive List desk with total calculated cards, update new desk into local database
          .then(async listUpdatedDesks => {
            await Promise.all(
              listUpdatedDesks.map(desk => {
                if (desk.active_status === DeletedStatus) {
                  return deleteDesk(desk._id);
                }
                return updateDesk(desk);
              }),
            );
            return listUpdatedDesks;
          })
          // Update list updated desks in state
          .then(listDesks => {
            dispatch(updateCurrentDesks(JSON.parse(JSON.stringify(listDesks))));
    
            return listDesks;
          })
          // Update list desk to mongoDB
          // TODO: Do the same thing of card. Just PUT desk having different modified time.
          .then(listDesks => {
            dispatch(setLoading(false));
            if (onlineState) {
              Promise.all(
                listDesks.map(desk => {
                  if (desk.active_status === DeletedStatus) {
                    return deleteDeskInRemote(accessToken, desk);
                  }
                  return updateDeskToRemote(accessToken, desk);
                }),
              );
            }
          })
          .catch(err => {
            console.log('Handle data error with message:', err);
          });
}

const compareListActiveDataInLocalWithRemote = (mergedList:any[], remoteList:any[]):any[] => {
  mergedList = mergedList.sort((itemA:any, itemB:any):number=>{
    return itemA._id < itemB._id ? 1 : -1;
  });
  remoteList = remoteList.sort((itemA:any, itemB:any):number=>{
    return itemA._id < itemB._id ? 1 : -1;
  });
  console.log('[MERGE]', mergedList);
  console.log('[REMOTE]', remoteList);
  let listChange = [];
  let j = 0;
  for (let i = 0; i < mergedList.length; i++){
    if (j<remoteList.length-1){

      while (mergedList[i]._id < remoteList[j]._id){
        j++;
      }
      if (mergedList[i]._id === remoteList[j]._id){
        const comparedObject = {...mergedList[i]};
  
        delete comparedObject.active_status;
        if(JSON.stringify(comparedObject) !== JSON.stringify(remoteList[j])){
          if (Date.parse(comparedObject.modified_time) > Date.parse(remoteList[j].modified_time)){
            listChange.push(mergedList[i]);
          }
        }
      }
    }else{
      listChange.push(mergedList[i]);
    }
  }

  return listChange;
}

export async function syncListCardsOfDesk(listRemoteCardsOfDesk: any[], deskId:string):Promise<any>{
    return await getListCurrentCardsOfDesk(deskId)
        .then(res=>{
            let listLocalCardsOfDesk:any = [];
            res?.forEach((result:any) => {
                for (let index = 0; index < result.rows.length; index++) {
                    listLocalCardsOfDesk.push(result.rows.item(index));
                }
            });
            const mergedList = mergeLocalAndRemoteData(listRemoteCardsOfDesk, listLocalCardsOfDesk);
            return mergedList;
        })
        .catch(err=>{
            console.log(err);
        });
};
export async function syncAllCards(listAllRemoteCards: any[]){
    return await getAllCards()
        .then(res=>{
            let listAllLocalCards:any = [];
            res?.forEach((result:any) => {
                for (let index = 0; index < result.rows.length; index++) {
                    listAllLocalCards.push(result.rows.item(index));
                }
            });
            const mergedList = mergeLocalAndRemoteData(listAllRemoteCards, listAllLocalCards);
            return mergedList;
        })
        .catch(err=>{
          console.log(err);
          return [];
        });
}
export async function syncCurrentCards(listRemoteCurrentCards: any[]){
    return await getListCurrentCards()
        .then(res=>{
            let listLocalCurrentCards:any = [];
            res?.forEach((result:any) => {
                for (let index = 0; index < result.rows.length; index++) {
                    listLocalCurrentCards.push(result.rows.item(index));
                }
            });
            const mergedList = mergeLocalAndRemoteData(listRemoteCurrentCards, listLocalCurrentCards);
            return mergedList;
        })
        .catch(err=>{
            console.log(err);
        });
}
export async function syncAllDesks(listRemoteDesks: any[]): Promise<any>{
    return await getListDesks()
        .then(res=>{
            let listLocalDesks: any[] = [];
             res?.forEach((result:any) => {
                for (let index = 0; index < result.rows.length; index++) {
                    listLocalDesks.push(result.rows.item(index));
                }
            });
            const mergedListDesks = mergeLocalAndRemoteData(listRemoteDesks, listLocalDesks);
            return mergedListDesks;
        })
        .catch(err=>{
            console.log(err);
        });
}



function mergeLocalAndRemoteData(remoteList:any[], localList:any[]):any[]{
    let mergedList: any[] = [];
    remoteList = remoteList.map(item=>{
        return {...item, active_status : "active"};
    });
    if (remoteList && localList){
        mergedList = remoteList.concat(localList);
        mergedList.sort((itemA, itemB)=>{
            if (itemA._id < itemB._id){
                return -1;
            }else{
                return 1;
            }
        });
        let i = 0;
        while(i<mergedList.length-1){
            if (!mergedList[i].active_status){
                mergedList.splice(i, 1);
                continue;
            };
            if ((mergedList[i]._id === mergedList[i + 1]._id)){
                if (mergedList[i].active_status === ActiveStatus && mergedList[i+1].active_status === DeletedStatus){
                    console.log("DELETE")
                    mergedList.splice(i, 1);
                } else
                if (mergedList[i].active_status === DeletedStatus && mergedList[i+1].active_status === ActiveStatus){
                    console.log("DELETE")
                    mergedList.splice(i + 1, 1);
                } else{
                    if ((Date.parse(mergedList[i].modified_time) < Date.parse(mergedList[i + 1].modified_time))){
                        mergedList.splice(i, 1);
                    }else {
                        mergedList.splice(i + 1, 1);
                    }
                }
                continue;
            }
            i++;
        }
        // mergedList = mergedList.filter((item, index)=>{
        //     return item.active_status === 'active';
        // });
    }else {
        mergedList = remoteList ? remoteList : localList;
    }
    return mergedList;
}



