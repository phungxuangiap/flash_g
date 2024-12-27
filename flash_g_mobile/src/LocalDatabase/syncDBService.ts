import getAllCurrentCards from "../service/getAllCurrentCards";
import { getListCurrentCards } from "./database";


export async function syncDesk(remoteDesk: any, deskId:string):Promise<void>{
    await getListCurrentCards(deskId)
        .then(res=>{
            //Merge remote and local desk
        })
        .catch(err=>{
            console.log(err);
        });
};



