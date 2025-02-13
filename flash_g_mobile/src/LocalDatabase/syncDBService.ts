
import { useDispatch } from "react-redux";
import { ActiveStatus, Auth, DeletedStatus, Login, RemoteStatus } from "../constants";
import { setUser } from "../redux/slices/authSlice";
import { updateCurrentDesks } from "../redux/slices/gameSlice";
import { setLoading } from "../redux/slices/stateSlice";
import { fetchAllCards, fetchCurrentUser, fetchListDesks } from "../service/fetchRemoteData";
import { deleteCardInRemote, deleteDeskInRemote, updateCardToRemote, updateDeskToRemote } from "../service/postToRemote";
import { createNewCard, createNewDesk, createNewImage, createNewUser, deleteCard, deleteDesk, deleteImage, getAllCards, getAllCurrentCardsOfDesk, getAllDesks, getAllLocalImage, getDesk, getDeskOfRemoteDeskId, getImageOfDesk, getListCurrentCards, getListCurrentCardsOfDesk, getListDesks, getUser, removeCard, removeCardOfRemoteId, removeDesk, updateCard, updateCardOfRemoteId, updateDesk, updateImage } from "./database";
import { Desk, Card, Image } from "./model";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { addImageToCloudinary, createImage, fetchImageOfDesk, fetchImagesOfDesks, updateImageOfDesk } from "../service/imageService";
import uuid from 'react-native-uuid';
import { refresh } from "../service/refreshAccessToken";
import createCard from "../service/createCard";
import createDesk from "../service/createDesk";
import createDeskInRemote from "../service/createDesk";


export async function calculateCardsAndUpdateDesk(updatedList:any[], createdList:any[], deletedList:any[]): Promise<any>{
  const deskIdMap: any = {};
  updatedList.forEach((item: any)=>{
    if (deskIdMap[item.remote_id]){
      deskIdMap[item.remote_id] = deskIdMap[item.remote_id].push({card: item, action: "update"});
    } else{
      deskIdMap[item.remote_id] = [item];
    }
  });
  createdList.forEach((item: any)=>{
    if (deskIdMap[item.remote_id]){
      deskIdMap[item.remote_id] = deskIdMap[item.remote_id].push({card: item, action: "create"});
    } else{
      deskIdMap[item.remote_id] = [item];
    }
  });
  deletedList.forEach((item: any)=>{
    if (deskIdMap[item.remote_id]){
      deskIdMap[item.remote_id] = deskIdMap[item.remote_id].push({card: item, action: "delete"});
    } else{
      deskIdMap[item.remote_id] = [item];
    }
  });
  for (let [deskId, listCardAction] of deskIdMap){
    let desk = getDesk(deskId);
    listCardAction.forEach((cardAction:any)=>{
      if (cardAction.action === 'create'){
        desk.new_card += 1;
      } else
      if (cardAction.action === 'update'){
        if (cardAction.desk.level < 2){
          desk.new_card += 1;
        } else
        if (cardAction.desk.level >= 2 && cardAction.desk.level <= 7){
          desk.in_progress += 1;
        } else{
          desk.preview += 1;
        }
      } else{
        // handle deleted desks
      }
    });
  }
}


export async function handleLocalAndRemoteData(onlineState:boolean, accessToken:string, dispatch:Dispatch<UnknownAction>, navigation:any){

    return await Promise.resolve()
          .then(() => {
            dispatch(setLoading(true));
          })
          // Fetch current user
          .then(async () => {

            let user = undefined;
            if (onlineState){
              // It'll have a responsibility to check current user, available accesstoken and refresh token for next requests below.
              user = await fetchCurrentUser(accessToken);
              console.log('USER', user);
              if (user){
                dispatch(setUser(user));
                createNewUser(user);
              } else{
                console.log("Fetch user error, try refreshing to get a new token...");
                await refresh(dispatch)
                  .catch(err=>{
                    console.log("Refresh access token error with message:", err)
                    dispatch(setLoading(false));
                    navigation.navigate(Auth);
                  });
              }
            }else {
              user = await getUser();
              if (user){
                    dispatch(setLoading(false));

                dispatch(setUser(user));
              } else{
                navigation.navigate(Auth);
              }
            }
            return user;
          })
          // Handle user's cardss
          .then(async user => {
            if (user) {
              let listLocalCard = [];
              let listRemoteCard = [];
              const [localResponse, remoteResponse] = await Promise.allSettled([
                getAllCards(),
                onlineState ? fetchAllCards(accessToken) : Promise.reject(),
              ]);
              if (localResponse.status === "fulfilled"){
                listLocalCard = localResponse.value;
              }
              if (remoteResponse.status === "fulfilled"){
                listRemoteCard = remoteResponse.value;
              }
              // merge remote and local cards
              const [
              listDeletedLocalCard,
              listCreatedLocalCard,
              listUpdatedLocalCard,
              listDeletedRemoteCard,
              listCreatedRemoteCard,
              listUpdatedRemoteCard,
              ] = syncCards(listLocalCard, listRemoteCard, remoteResponse.status === 'fulfilled' ? true : false);
              console.log("CREATE LOCAL CARD", listCreatedLocalCard);
              console.log("UPDATE LOCAL CARD", listUpdatedLocalCard);
              console.log("DELETE LOCAL CARD", listDeletedLocalCard);
              console.log("CREATE REMOTE CARD", listCreatedRemoteCard);
              console.log("UPDATE REMOTE CARD", listUpdatedRemoteCard);
              console.log("DELETE REMOTE CARD", listDeletedRemoteCard);
              // update cards to remote

              if (onlineState){
                
                Promise.all(
                  [
                    ...listDeletedRemoteCard.map((deletedCard: any)=>{
                      return deleteCardInRemote(accessToken, deletedCard);
                    }),
                    ...listUpdatedRemoteCard.map((updatedCard: any)=>{
                      return updateCardToRemote(accessToken, updatedCard);
                    }),
                  ]
                );
              }
              // filter deskid of changed cards, update cards to local
              Promise.all(
                [
                  ...listDeletedLocalCard.map((deletedCard: any)=>{

                    return removeCard(deletedCard._id);
                  }),
                  ...listUpdatedLocalCard.map((updatedCard: any)=>{
                    return updateCard(updatedCard);
                  }),
                ]
              );
              return {listCreatedRemoteCard: listCreatedRemoteCard, listCreatedLocalCard:listCreatedLocalCard};
            } else {
              return false;
            }
          })
          // handle remote and local desks
          .then(async ({listCreatedRemoteCard, listCreatedLocalCard}) => {
            let mergedDesks = [];
            let listLocalDesk = [];
            let listRemoteDesk = [];
            const [localResponse, remoteResponse] = await Promise.allSettled([
              getAllDesks(),
              onlineState ? fetchListDesks(accessToken) : Promise.reject(),
            ]);
            if (localResponse.status === "fulfilled"){
              listLocalDesk = localResponse.value;
            }
            if (remoteResponse.status === "fulfilled"){
              listRemoteDesk = remoteResponse.value;
            }
            mergedDesks = mergeDesk(listLocalDesk, listRemoteDesk, remoteResponse.status === 'fulfilled' ? true : false);
            console.log("[MERGE DESK LIST]", mergedDesks);
            let listUpdatedDesks = [];
            listUpdatedDesks =  await Promise.all(
              mergedDesks.map((desk, index)=>{
                return getAllCurrentCardsOfDesk(desk._id)
                  .then(listCurrentCards=>{
                    let newCard = 0;
                    let inProgressCard = 0;
                    let previewCard = 0;
                    listCurrentCards.forEach(card=>{
                      if (card.status === 'new'){
                        newCard++;
                      } else if (card.status === 'inprogress'){
                        inProgressCard++;
                      } else {
                        previewCard++;
                      }
                    });
                    listCreatedLocalCard.forEach(card=>{
                      if (card.remote_desk_id === desk.remote_id){
                        if (card.status === 'new'){
                          newCard++;
                        } else if (card.status === 'inprogress'){
                          inProgressCard++;
                        } else {
                          previewCard++;
                        }
                      }
                    })
                    let newDesk = desk;
                    newDesk.new_card = newCard;
                    newDesk.inprogress_card = inProgressCard;
                    newDesk.preview_card = previewCard;
                    if (newDesk.new_card !== desk.new_card || newDesk.inprogress_card !== desk.inprogress_card || newDesk.preview_card !== desk.preview_card){
                      newDesk.modified_time = (JSON.stringify(new Date())).slice(1, -1);
                    }
                    return newDesk;
                  });
              })
            );
            return {listUpdatedDesks: listUpdatedDesks, listLocalDesk: listLocalDesk, listRemoteDesk: listRemoteDesk, listCreatedRemoteCard: listCreatedRemoteCard, listCreatedLocalCard:listCreatedLocalCard};
          })
          // sync local and remote desks with merged desks
          .then(({listUpdatedDesks, listLocalDesk, listRemoteDesk, listCreatedRemoteCard, listCreatedLocalCard}:any)=>{
            //update redux state
            dispatch(updateCurrentDesks(JSON.parse(JSON.stringify(listUpdatedDesks))));
            dispatch(setLoading(false));
            Promise.allSettled(
              [
                onlineState ?
                syncDesksToRemote(listRemoteDesk, listUpdatedDesks, accessToken)
                  .then(res=>{
                    // after having remote_id, let's set it to card id
                    Promise.allSettled(
                      listCreatedRemoteCard.map((card:any)=>{
                        getDesk(card.desk_id)
                          .then(async (desk : any)=>{
                            return await createCard(accessToken, desk.remote_id, card);
                          })
                          .then(newCard=>{
                            //update remote_id and remote_desk_id of card in local
                            updateCard({...card, remote_id: newCard._id, remote_desk_id: newCard.desk_id, active_status: RemoteStatus, original_id: newCard._id});
                          });
                      })
                    )
                  })
                  .catch(err=>{
                    console.log("Sync desk to remote error with message:", err);
                  })
                 : Promise.reject(),
                syncDesksToLocal(listLocalDesk, listUpdatedDesks, accessToken)
                  .then(res=>{
                    Promise.all(
                      listCreatedLocalCard.map(card=>{
                        return getDeskOfRemoteDeskId(card.remote_desk_id)
                          .then(res=>{
                            updateCard({...card, _id: uuid.v4(), desk_id: res._id});
                            removeCardOfRemoteId(card.remote_id);
                            
                          });
                      })
                    )
                  }),
              ]
            );
          })
          //handle image
          .then(res=>{
            uploadImage(onlineState, accessToken);
          })
          .catch(error=>{
            console.log("Sync flow error with message:", error);
          });
}


const mergeDesk = (localDesks: any[], remoteDesks: any[], onlineState: boolean) : any[] =>{
  let mergedList:any[] = [];
  localDesks = localDesks.sort((itemA:any, itemB: any)=>{
    return itemA.remote_id < itemB.remote_id ? 1 : -1;
  });
  remoteDesks = remoteDesks.sort((itemA:any, itemB: any)=>{
    return itemA._id < itemB._id ? 1 : -1;
  });
  console.log('[Local Desk]', localDesks);
  console.log('[Remote Desk]', remoteDesks);
  // if you don't have internet, let's use data in local;
  if (!onlineState){
    console.log("ahihi")
    return localDesks;
  }
  let remoteIndex = 0;
  // case remote desk is empty
  if (remoteDesks.length===0){
    // post all local desks to remote
    for (let localIndex = 0; localIndex<localDesks.length; localIndex++){
      if (localDesks[localIndex].active_status === DeletedStatus){
        //do nothing
      } else
      if (localDesks[localIndex].active_status === ActiveStatus){
        // create remote desk
        mergedList.push(localDesks[localIndex]);
      }
    }
  } else
  // case both local desks and remote desks have data

  if (remoteDesks.length !== 0 && localDesks.length !== 0){
    for (let localIndex = 0; localIndex < localDesks.length; localIndex++){
      while (remoteIndex < remoteDesks.length && remoteDesks[remoteIndex]._id > localDesks[localIndex].remote_id){
        // when two desk in remote and local is valid and we found new desk in remote (it cannot in case local deleted but remote haven't, because local and remote desk delete in one time)
        if(remoteDesks[remoteIndex] && localDesks[localIndex] && localDesks[localIndex].remote_id < remoteDesks[remoteIndex]._id){
          // create local desk
          const deskElement = remoteDesks[remoteIndex];
          const localId = uuid.v4();
          const newDesk = new Desk(localId, deskElement.user_id, deskElement.author_id, deskElement.original_id, deskElement.access_status, deskElement.title, deskElement.description, deskElement.primary_color, deskElement.new_card, deskElement.inprogress_card, deskElement.preview_card, deskElement.modified_time, RemoteStatus, deskElement._id);
          mergedList.push(newDesk);
          remoteIndex++;
        }
      }
      if (remoteIndex < remoteDesks.length && remoteDesks[remoteIndex]._id === localDesks[localIndex].remote_id){
        // when two desk have same id. we need to decide to update in remote or local
        if (localDesks[localIndex].active_status === DeletedStatus){
            // Delete desk in remote
            // do nothing
            // Delete desk in local
            // do nothing
            mergedList.push(localDesks[localIndex]);
        } else{
          if (Date.parse(localDesks[localIndex].modified_time) < Date.parse(remoteDesks[remoteIndex].modified_time)){
            // update local
            const deskElement = remoteDesks[remoteIndex];
            const newDesk = new Desk(localDesks[localIndex].remote_id, deskElement.user_id, deskElement.author_id, deskElement.original_id, deskElement.access_status, deskElement.title, deskElement.description, deskElement.primary_color, deskElement.new_card, deskElement.inprogress_card, deskElement.preview_card, deskElement.modified_time, RemoteStatus, deskElement._id);
            mergedList.push(newDesk);
          } else if (Date.parse(localDesks[localIndex].modified_time) > Date.parse(remoteDesks[remoteIndex].modified_time)){
            // update remote
            mergedList.push(localDesks[localIndex]);
          } else{
            if (localDesks[localIndex].active_status === ActiveStatus){
              // update local desk to Remote Status
              mergedList.push({...localDesks[localIndex], active_status: RemoteStatus});
            } else if (localDesks[localIndex].active_status === RemoteStatus){
              mergedList.push({...localDesks[localIndex]});
            }
          }
        }
        remoteIndex++;
        continue;
      }
      if (remoteIndex < remoteDesks.length && remoteDesks[remoteIndex]._id < localDesks[localIndex].remote_id){
        if (localDesks[localIndex].active_status === ActiveStatus){
          //create remote desk
          mergedList.push(localDesks[localIndex]);
        } else if (localDesks[localIndex].active_status === RemoteStatus){
          //delete local desk
          //do nothing
        }
        continue;
      }        

      // after looping all remote desks, but still have local desk not handled
      if (remoteIndex >= remoteDesks.length){
        // post all retain local desk to remote
        if (localDesks[localIndex].active_status === DeletedStatus){
          // delete local desk
          // do nothing
        } else
        if (localDesks[localIndex].active_status === ActiveStatus){
          // create remote desk
          mergedList.push(localDesks[localIndex]);
        }
      }
    }
    // after looping all local desks but we still have remote desk not handled
    if (remoteIndex < remoteDesks.length){
      // pull all retain remote desk to local
      for (let index = remoteIndex; index < remoteDesks.length; index++){
        const deskElement = remoteDesks[index];
        const localId = uuid.v4();
        const newDesk = new Desk(localId, deskElement.user_id, deskElement.author_id, deskElement.original_id, deskElement.access_status, deskElement.title, deskElement.description, deskElement.primary_color, deskElement.new_card, deskElement.inprogress_card, deskElement.preview_card, deskElement.modified_time, RemoteStatus, deskElement._id);

        mergedList.push(newDesk);
      }
    }
  } else
  // case local desk empty
  if (localDesks.length ===0){
    for (let index = 0; index < remoteDesks.length; index++){
      const deskElement = remoteDesks[index];
      const localId = uuid.v4();
      const newDesk = new Desk(localId, deskElement.user_id, deskElement.author_id, deskElement.original_id, deskElement.access_status, deskElement.title, deskElement.description, deskElement.primary_color, deskElement.new_card, deskElement.inprogress_card, deskElement.preview_card, deskElement.modified_time, RemoteStatus, deskElement._id);

      mergedList.push(newDesk);
    }
  }
  return mergedList;
};

// const syncImage = async (onlineState: boolean, accessToken:string) => {
//   let syncedList:any[] = [];
//   let localImages : any[] = [];
//   let remoteImages : any[] = [];
//   let mergedDeskIds: any[] = [];
//   getAllDesks()
//     .then((allDesks:any[])=>{
//       mergedDeskIds = allDesks.map(desk=>{
//         return desk.remote_id;
//       });
//       Promise.allSettled(
//         [
//           getAllLocalImage().then(res=>{
//             localImages = res;
//           }),
//           onlineState ? fetchImagesOfDesks(accessToken, mergedDeskIds).then(res=>{
//             remoteImages = res;
//           }) : Promise.resolve([]),
//         ]
//       ).then(res=>{
//         localImages.sort((itemA:any, itemB:any)=>{
//           return itemA.remote_id < itemB.remote_id ? 1 : -1;
//         });
//         remoteImages.sort((itemA:any, itemB:any)=>{
//           return itemA.remote_id < itemB.remote_id ? 1 : -1;
//         });
//         //case only have remote images
//         if (localImages.length === 0 && remoteImages.length !== 0){
//           Promise.all(remoteImages.map(image =>{
//             return getDeskOfRemoteDeskId(image.desk_id)
//               .then(localDesk=>{
//                 const newLocalImage = new Image(uuid.v4(), image._id, image.desk_id, localDesk._id, image.type, image.img_url, image.modified_time);
//                 createNewImage(newLocalImage);
//               })
//               .catch(error=>{
//                 console.log("cannot find desk having id:", image.desk_id, error);
//               });
//           }));
//         } else
//         if (localImages.length !== 0 && remoteImages.length !== 0){
//           // merge
//           let remoteIndex = 0;
//           for (let localIndex = 0; localIndex < localImages.length; localIndex++){
//             while (remoteIndex < remoteImages.length && remoteImages[remoteIndex]._id > localImages[localIndex].remote_id){
//               // if remote have new image, let create in local
//               getDeskOfRemoteDeskId(remoteImages[remoteIndex].desk_id)
//                 .then(localDesk=>{
//                   const newLocalImage = new Image(uuid.v4(), remoteImages[remoteIndex]._id, remoteImages[remoteIndex].desk_id, localDesk._id, remoteImages[remoteIndex].type, remoteImages[remoteIndex].img_url, remoteImages[remoteIndex].modified_time);
//                   createNewImage(newLocalImage);
//                 })
//                 .catch(error=>{
//                   console.log("cannot find desk having id:", remoteImages[remoteIndex].desk_id, error);
//                 });
//               remoteIndex++;
//             }
//             if (remoteIndex < remoteImages.length && remoteImages[remoteIndex]._id === localImages[localIndex].remote_id){
//               if (remoteImages[remoteIndex].modified_time < localImages[localIndex].modified_time){
//                 const formData = new FormData();
//                 formData.append("image", {
//                   uri: localImages[localIndex].img_url,
//                   type: localImages[localIndex].type,
//                   name: `${uuid.v4()}.jpg`,
//                 });
//                 addImageToCloudinary(formData, accessToken).then(res=>{
//                   console.log(res);
//                   console.log(res.path);
//                   console.log("To Cloudinary successfully!");
//                   updateImageOfDesk(accessToken, localImages[localIndex].remote_desk_id, {img_url: res.path, type: localImages[localIndex].type, modified_time: localImages[localIndex].modified_time});
//                 });
                
//               } else
//               if (remoteImages[remoteIndex].modified_time > localImages[localIndex].modified_time){
//                 // update image in local
//                 getDeskOfRemoteDeskId(remoteImages[remoteIndex].desk_id)
//                   .then(localDesk=>{
//                     const newLocalImage = new Image(uuid.v4(), remoteImages[remoteIndex]._id, remoteImages[remoteIndex].desk_id, localDesk._id, remoteImages[remoteIndex].type, remoteImages[remoteIndex].img_url, remoteImages[remoteIndex].modified_time);
//                     updateImage(newLocalImage);
//                   })
//               }
//               remoteIndex++;
//             } else
//             if (remoteIndex < remoteImages.length && remoteImages[remoteIndex]._id < localImages[localIndex].remote_id){
//               // add to cloudinary and create new image in remote
//               const formData = new FormData();
//               formData.append("image", {
//                 uri: localImages[localIndex].img_url,
//                 type: localImages[localIndex].type,
//                 name: `${uuid.v4()}.jpg`,
//               });
//               addImageToCloudinary(formData, accessToken)
//                 .then(response=>{
//                   getDesk(localImages[localIndex].desk_id)
//                     .then(desk=>{
//                       return createImage({img_url: response.path, type: localImages[localIndex].type, modified_time: localImages[localIndex].modified_time}, desk.remote_id, accessToken);
//                     })
//                     .then(newDesk=>{
//                       updateImage()
//                     })
//                 })
              
//             } else
//             if (remoteIndex > remoteImages.length){
//               // create remote image and update remote id of local image
//             }
//           }
//         } else
//         if (localImages.length !== 0 && remoteImages.length === 0){
//           // add to cloudinary and create new image in remote
//         }
//       });
//     });
// };

const uploadImage = async (onlineState:boolean, accessToken: string) => {
  if (onlineState){
    getAllLocalImage()
      .then(listLocalImage =>{
        Promise.all(
          listLocalImage.map(async localImage=>{
            const file = new FormData();
            file.append("image", {
              uri: localImage.img_url,
              type: localImage.type,
              name: `${uuid.v4()}.jpg`,
            });
            const imageResponse = await addImageToCloudinary(file, accessToken);
            const desk = await getDesk(localImage.desk_id);
            if (desk){
              createImage(
                {
                  img_url: imageResponse.path,
                  type: imageResponse.mimetype,
                  modified_time: localImage.modified_time,
                },
                desk.remote_id,
                accessToken
              );
              deleteImage(localImage.desk_id);
            } else{
              console.log("Cannot find desk");
            }
          })
        );
      });
  }
};

const syncCards = (localCards:any[], remoteCards: any[], onlineState : boolean): any[] =>{
  console.log('[Local Card]', localCards);
  console.log('[Remote Card]', remoteCards);
  let listDeletedLocalCard:any[] = [];
  let listCreatedLocalCard:any[] = [];
  let listUpdatedLocalCard:any[] = [];
  let listDeletedRemoteCard:any[] = [];
  let listCreatedRemoteCard:any[] = [];
  let listUpdatedRemoteCard:any[] = [];
  localCards = localCards.sort((itemA:any, itemB: any)=>{
    return itemA.remote_id < itemB.remote_id ? 1 : -1;
  });
  remoteCards = remoteCards.sort((itemA:any, itemB: any)=>{
    return itemA._id < itemB._id ? 1 : -1;
  });
  // in case offline, just return empty arrays 
  if (!onlineState){
    return [listDeletedLocalCard, listCreatedLocalCard, listUpdatedLocalCard, listDeletedRemoteCard, listCreatedRemoteCard, listUpdatedRemoteCard];
  }
  let remoteIndex = 0;
  // case remote cards is empty
  if (remoteCards.length===0){
    // post all local cards to remote
    for (let localIndex = 0; localIndex<localCards.length; localIndex++){
      if (localCards[localIndex].active_status === DeletedStatus){
        // delete local card
        listDeletedLocalCard.push(localCards[localIndex]);
      } else
      if (localCards[localIndex].active_status === ActiveStatus){
        // create remote card
        listCreatedRemoteCard.push(localCards[localIndex]);
      } else{
        listDeletedLocalCard.push(localCards[localIndex]);
      }
    }
  } else
  // case both local cards and remote cards have data
  if (remoteCards.length!==0 && localCards.length!==0){
    for (let localIndex = 0; localIndex < localCards.length; localIndex++){
      while (remoteIndex < remoteCards.length && remoteCards[remoteIndex]._id > localCards[localIndex].remote_id){
        // when two card in remote and local is valid and we found new card in remote (it cannot in case local deleted but remote haven't, because local and remote card delete in one time)
        if(remoteCards[remoteIndex] && localCards[localIndex] && localCards[localIndex].remote_id < remoteCards[remoteIndex]._id){
          // create local card
          const cardElement = remoteCards[remoteIndex];
          const localId = uuid.v4();
          const newCard = new Card(localId, "", cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus, cardElement._id, cardElement.desk_id);
          listCreatedLocalCard.push(newCard);
          remoteIndex++;
        }
      }
      if (remoteIndex < remoteCards.length && remoteCards[remoteIndex]._id === localCards[localIndex].remote_id){
        // when two card have same id. we need to decide to update in remote or local
        if (localCards[localIndex].active_status === DeletedStatus){
            // Delete card in remote
            listDeletedRemoteCard.push(localCards[localIndex]);
            // Delete card in local
            listDeletedLocalCard.push(localCards[localIndex]);
        } else{
          if (Date.parse(localCards[localIndex].modified_time) < Date.parse(remoteCards[remoteIndex].modified_time)){
            // update local
            const cardElement = remoteCards[remoteIndex];
            const newCard = new Card(localCards[localIndex]._id, localCards[localIndex].desk_id, cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus, cardElement._id, localCards[localIndex].remote_desk_id);
            listUpdatedLocalCard.push(newCard);
          } else if (Date.parse(localCards[localIndex].modified_time) > Date.parse(remoteCards[remoteIndex].modified_time)){
            // update remote
            listUpdatedRemoteCard.push(localCards[localIndex]);
          } else{
            if (localCards[localIndex].active_status === ActiveStatus){
              // update local card to Remote Status
              listUpdatedLocalCard.push({...localCards[localIndex], active_status: RemoteStatus});
            }
          }
        }
        remoteIndex++;
        continue;
      }
      if (remoteIndex < remoteCards.length && remoteCards[remoteIndex]._id < localCards[localIndex].remote_id){
        if (localCards[localIndex].active_status === ActiveStatus){
          //create remote card
          listCreatedRemoteCard.push(localCards[localIndex]);
        } else if (localCards[localIndex].active_status === RemoteStatus){
          //delete local card
          listDeletedLocalCard.push(localCards[localIndex]);
        }
        continue;
      }        

      // after looping all remote cards, but still have local desk not handled
      if (remoteIndex>=remoteCards.length){
        // post all retain local cards to remote
        if (localCards[localIndex].active_status === DeletedStatus){
          // delete local card
          listDeletedLocalCard.push(localCards[localIndex]);
        } else
        if (localCards[localIndex].active_status === ActiveStatus){
          // create remote card
          listCreatedRemoteCard.push(localCards[localIndex]);
        }
      }
    }
    // after looping all local cards but we still have remote card not handled
    if (remoteIndex < remoteCards.length){
      // pull all retain remote card to local
      for (let index = remoteIndex; index < remoteCards.length; index++){
        const cardElement = remoteCards[index];
        const localId = uuid.v4();
        const newCard = new Card(localId, "", cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus, cardElement._id, cardElement.desk_id);
        listCreatedLocalCard.push(newCard);
      }
    }
  } else
  // case local card empty
  if (localCards.length ===0){
    for (let index = 0; index < remoteCards.length; index++){
      const cardElement = remoteCards[index];
      const localId = uuid.v4();
      const newCard = new Card(localId, "", cardElement.user_id, cardElement.author_id, cardElement.original_id, cardElement.status, cardElement.level, cardElement.last_preview, cardElement.vocab, cardElement.description, cardElement.sentence, cardElement.vocab_audio, cardElement.sentence_audio, cardElement.type, cardElement.modified_time, RemoteStatus, cardElement._id, cardElement.desk_id);
      listCreatedLocalCard.push(newCard);
    }
  }
  return [listDeletedLocalCard, listCreatedLocalCard, listUpdatedLocalCard, listDeletedRemoteCard, listCreatedRemoteCard, listUpdatedRemoteCard];
};

export async function syncDesksToRemote(listRemoteDesk:any[], listUpdatedDesks:any[], accessToken:string){
  //todo
  listRemoteDesk.sort((item1:any, item2:any)=>{
    return item1._id < item2._id ? 1 : -1;
  });
  listUpdatedDesks.sort((item1:any, item2:any)=>{
    return item1.remote_id < item2.remote_id ? 1 : -1;
  });
  // Chỉ handle 3 trường hợp: Remote thiêú thì tạo, Remote dư thì xóa, Remote cũ thì cập nhậtnhật
  let remoteIndex = 0;
  for (let updatedIndex = 0; updatedIndex < listUpdatedDesks.length; updatedIndex++){
    while (remoteIndex < listRemoteDesk.length && listRemoteDesk[remoteIndex]._id > listUpdatedDesks[updatedIndex].remote_id){
      // Remote dư thì xóa
      deleteDeskInRemote(accessToken, listRemoteDesk[remoteIndex]._id);
      remoteIndex++;
    }
    if (remoteIndex >= listRemoteDesk.length){
      // Remote thiếu thì tạo
      await createDeskInRemote(listUpdatedDesks[updatedIndex].title, listUpdatedDesks[updatedIndex].primary_color, listUpdatedDesks[updatedIndex].description, listUpdatedDesks[updatedIndex].modified_time, listUpdatedDesks[updatedIndex].access_status, accessToken)
        .then((newDesk:any)=>{
          updateDesk({...listUpdatedDesks[updatedIndex], active_status: RemoteStatus, remote_id: newDesk._id, original_id: newDesk._id});
        });
    }
    if (remoteIndex < listRemoteDesk.length && listRemoteDesk[remoteIndex]._id < listUpdatedDesks[updatedIndex].remote_id){
      // Remote thiêú thì tạo
      await createDeskInRemote(listUpdatedDesks[updatedIndex].title, listUpdatedDesks[updatedIndex].primary_color, listUpdatedDesks[updatedIndex].description, listUpdatedDesks[updatedIndex].modified_time, listUpdatedDesks[updatedIndex].access_status, accessToken)
        .then((newDesk:any)=>{
          updateDesk({...listUpdatedDesks[updatedIndex], active_status: RemoteStatus, remote_id: newDesk._id, original_id: newDesk._id});
        });
    }
    if (remoteIndex < listRemoteDesk.length && listRemoteDesk[remoteIndex]._id === listUpdatedDesks[updatedIndex].remote_id){
      if (listUpdatedDesks[updatedIndex].active_status === DeletedStatus){
        deleteDeskInRemote(accessToken, listUpdatedDesks[updatedIndex].remote_id);
      } else
      // Remote củ thì update
      if (Date.parse(listRemoteDesk[remoteIndex].modified_time) < Date.parse(listUpdatedDesks[updatedIndex].modified_time)){
        updateDeskToRemote(accessToken, listUpdatedDesks[updatedIndex].remote_id, listUpdatedDesks[updatedIndex]);
      }
      remoteIndex++;
      continue;
    }
  }
}
export async function syncDesksToLocal(listLocalDesk:any[], listUpdatedDesks:any[], accessToken:string){
  //todo
  listLocalDesk.sort((item1:any, item2:any)=>{
    return item1.remote_id < item2.remote_id ? 1 : -1;
  });
  listUpdatedDesks.sort((item1:any, item2:any)=>{
    return item1.remote_id < item2.remote_id ? 1 : -1;
  });
  // Chỉ handle 3 trường hợp: Remote thiêú thì tạo, Remote dư thì xóa, Remote cũ thì cập nhật
  let localIndex = 0;
  if (listUpdatedDesks.length === 0){
    Promise.all(
      listLocalDesk.map((desk:any)=>{
        return removeDesk(desk._id);
      })
    );
  }
  for (let updatedIndex = 0; updatedIndex < listUpdatedDesks.length; updatedIndex++){
    while (localIndex < listLocalDesk.length && listLocalDesk[localIndex].remote_id > listUpdatedDesks[updatedIndex].remote_id){
      // Local dư thì xóa
      removeDesk(listLocalDesk[localIndex]._id);
      localIndex++;
    }
    if (localIndex >= listLocalDesk.length){
      console.log("Create");
      await createNewDesk(listUpdatedDesks[updatedIndex]);
    }
    if (localIndex < listLocalDesk.length && listLocalDesk[localIndex].remote_id < listUpdatedDesks[updatedIndex].remote_id){
      // Local thiêú thì tạo
      console.log("Crete")
      await createNewDesk(listUpdatedDesks[updatedIndex]);
    }
    if (localIndex < listLocalDesk.length && listLocalDesk[localIndex].remote_id === listUpdatedDesks[updatedIndex].remote_id){
      if (listUpdatedDesks[updatedIndex].active_status === DeletedStatus){
        removeDesk(listUpdatedDesks[updatedIndex]._id);
      } else
      // Local củ thì update
      if (Date.parse(listLocalDesk[localIndex].modified_time) < Date.parse(listUpdatedDesks[updatedIndex].modified_time)){
        updateDesk(listUpdatedDesks[updatedIndex]);
      }
      localIndex++;
      continue;
    }
  }
}

