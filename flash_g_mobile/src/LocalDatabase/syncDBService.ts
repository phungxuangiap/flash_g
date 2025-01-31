
import { useDispatch } from "react-redux";
import { ActiveStatus, DeletedStatus, RemoteStatus } from "../constants";
import { setUser } from "../redux/slices/authSlice";
import { updateCurrentDesks } from "../redux/slices/gameSlice";
import { setLoading } from "../redux/slices/stateSlice";
import { fetchAllCards, fetchCurrentUser, fetchListDesks } from "../service/fetchRemoteData";
import { deleteCardInRemote, deleteDeskInRemote, updateCardToRemote, updateDeskToRemote } from "../service/postToRemote";
import { createNewUser, deleteCard, deleteDesk, getAllCards, getListCurrentCards, getListCurrentCardsOfDesk, getListDesks, removeCard, removeDesk, updateCard, updateDesk } from "./database";
import { Desk, Card } from "./model";
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
              let listAllLocakCards:any[] = [];
              const localCardsResponseawait = await getAllCards();
              localCardsResponseawait?.forEach((result:any) => {
                for (let index = 0; index < result.rows.length; index++) {
                    listAllLocakCards.push(result.rows.item(index));
                }
              });
              syncCards(listAllLocakCards, listAllRemoteCards, accessToken);

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
                      if (card.active_status !== DeletedStatus) {
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
                      desk.author_id,
                      desk.original_id,
                      desk.access_status,
                      desk.title,
                      desk.description,
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
                    return Promise.all([
                      deleteDeskInRemote(accessToken, desk),
                      removeDesk(desk._id),

                    ])
                    
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


const syncCards = (localCards:any[], remoteCards: any[], accessToken:string): Promise<any> =>{
  const listMerge:any[] = [];
  localCards = localCards.sort((itemA:any, itemB: any)=>{
    return itemA._id < itemB._id ? 1 : -1;
  });
  remoteCards = remoteCards.sort((itemA:any, itemB: any)=>{
    return itemA._id < itemB._id ? 1 : -1;
  });
  console.log('[LOCAL]', localCards);
  console.log('[REMOTE]', remoteCards);
  let remoteIndex = 0;
  for (let localIndex = 0; localIndex < localCards.length; localIndex++){
    if (remoteIndex < remoteCards.length){
      while (remoteCards[remoteIndex] && localCards[localIndex] && localCards[localIndex]._id < remoteCards[remoteIndex]._id){
        const cardElement = remoteCards[remoteIndex];
        const updatedCard = new Card(cardElement._id, cardElement.desk_id, cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus);
        updateCard(updatedCard);
        listMerge.push({method: "Update new remote card to local", data: remoteCards[remoteIndex]});
        remoteIndex++;
        if (remoteIndex >= remoteCards.length){
          break;
        }
      }
      

      if (remoteCards[remoteIndex] && localCards[localIndex] && localCards[localIndex]._id > remoteCards[remoteIndex]._id){
        if (localCards[localIndex].active_status!==DeletedStatus){

          let objectTmp = {...localCards[localIndex]}
          delete objectTmp.active_status;
          updateCardToRemote(accessToken, objectTmp);
          if (localCards[localIndex].active_status === ActiveStatus){
            const cardElement = objectTmp;
            const updatedCard = new Card(cardElement._id, cardElement.desk_id, cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus);
            updateCard(updatedCard);
          }
          listMerge.push({method: "Update local to remote", data: objectTmp});
        }

      }
      if (remoteCards[remoteIndex] && localCards[localIndex] && localCards[localIndex]._id === remoteCards[remoteIndex]._id){
        let objectTmp = {...localCards[localIndex]};
        delete objectTmp.active_status;
        if (JSON.stringify(objectTmp) !== JSON.stringify(remoteCards[remoteIndex])){
          if (Date.parse(objectTmp.modified_time) > Date.parse(remoteCards[remoteIndex].modified_time)){
            if (localCards[localIndex].active_status !== DeletedStatus){
              listMerge.push({method: "Update remote when local change", data: objectTmp});

              updateCardToRemote(accessToken, objectTmp);
            } else{
              listMerge.push({method: "Delete local and remote", data: objectTmp});
              deleteCardInRemote(accessToken, objectTmp);
              // remove card out of the local data
              // deleteCard(objectTmp._id);
              removeCard(objectTmp._id);

            }
          } else if (Date.parse(objectTmp.modified_time) < Date.parse(remoteCards[remoteIndex].modified_time)){
            listMerge.push({method: "Update updated card to local", data: remoteCards[remoteIndex]});
            const cardElement = remoteCards[remoteIndex];
            const updatedCard = new Card(cardElement._id, cardElement.desk_id, cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus);
            updateCard(updatedCard);
          }
        }
        remoteIndex++;
      } 
    } else {
      if (
        (remoteCards.length ===0 && localCards[localIndex])
        ||
        (
        remoteCards[remoteIndex] && 
        localCards[localIndex] && 
        localCards[localIndex].active_status !== RemoteStatus && 
        localCards[localIndex].active_status !== DeletedStatus)
      ){
        let objectTmp = {...localCards[localIndex]}
        delete objectTmp.active_status;
        updateCardToRemote(accessToken, objectTmp);
        if (localCards[localIndex].active_status === ActiveStatus){
          const cardElement = objectTmp;
            const updatedCard = new Card(cardElement._id, cardElement.desk_id, cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus);
            updateCard(updatedCard);
        }
        listMerge.push({method: "Update remote", data: localCards[localIndex]})
      }else{
        deleteCard(localCards[localIndex]._id);
        listMerge.push({method: "Delete local", data: localCards[localIndex]._id});
      }
    }
  }
  if (remoteIndex < remoteCards.length){
    for (let j = remoteIndex; j < remoteCards.length; j++){
      const cardElement = remoteCards[j];
      const updatedCard = new Card(cardElement._id, cardElement.desk_id, cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus);
      updateCard(updatedCard);
      listMerge.push({method: "Update local", data: remoteCards[j]});
    }
  }
  console.log('[MERGE]', listMerge)
  return Promise.resolve();
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

                    mergedList.splice(i, 1);
                } else
                if (mergedList[i].active_status === DeletedStatus && mergedList[i+1].active_status === ActiveStatus){

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



