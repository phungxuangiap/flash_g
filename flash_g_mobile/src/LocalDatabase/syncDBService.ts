
import { ActiveStatus } from "../constants";
import { getAllCards, getListCurrentCards, getListCurrentCardsOfDesk, getListDesks } from "./database";


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
            console.log(mergedList[i], mergedList[i].active_status, !mergedList[i].active_status);
            if (!mergedList[i].active_status){
                mergedList.splice(i, 1);
                continue;
            };
            if ((mergedList[i]._id === mergedList[i + 1]._id)){
                if (mergedList[i].active_status === 'active' && mergedList[i+1].active_status === 'deleted'){
                    mergedList.splice(i, 1);
                } else
                if (mergedList[i].active_status === 'deleted' && mergedList[i+1].active_status === 'active'){
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
        mergedList = mergedList.filter((item, index)=>{
            return item.active_status === 'active';
        });
        console.log('[MERGE LIST]', mergedList);
    }else {
        mergedList = remoteList ? remoteList : localList;
    }
    return mergedList;
}



