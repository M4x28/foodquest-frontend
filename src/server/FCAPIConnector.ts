import { FCEndpoint } from "./server";

export default class StrapiFCAPI implements FCEndpoint{

    constructor(serverUrl:string){
        //TODO
    }

    async fetchMaxPoint(userID: string):Promise<number>{
        //TODO
        console.log("Max points Requested for",userID);
        return 69420;
    }

    async setPointUsage(userID: string, isUsingPoint: boolean):Promise<void>{
        //TODO
        console.log("Now ",userID,(isUsingPoint ? "is" : "is not") + " using Points");
        return;
    }

}