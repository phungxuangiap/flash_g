
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
        for (let i = 0; i < mergedList.length - 1; i++){
            if ((mergedList[i]._id === mergedList[i + 1]._id)){
                if ((Date.parse(mergedList[i].modified_time) < Date.parse(mergedList[i + 1].modified_time))){
                    mergedList.splice(i, 1);
                }else {
                    mergedList.splice(i + 1, 1);
                }
            }
        }
        console.log(mergedList);
    }else {
        mergedList = remoteList ? remoteList : localList;
    }
    return mergedList;
}



