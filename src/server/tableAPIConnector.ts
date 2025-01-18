import axios from "axios";
import { TableEndpoint,table } from "./server.ts";

export default class StrapiTableEndpoint implements TableEndpoint{

    private __endpoint__:string;

    constructor(serverUrl:string){
        this.__endpoint__ = serverUrl + "/api/table";
    }

    async fetchTableStatus(table: table):Promise<string>{
        return await axios.post(`${this.__endpoint__}/status`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
            }
        }).then((res) => res.data);
    }

    askForCheck (table: table):Promise<void>{
        return axios.post(`${this.__endpoint__}/checkRequest`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
            }
        });
    };

    fetchTotal (table: table) :Promise<{ total: number; discount: number; }>{
        return axios.get(`${this.__endpoint__}/total/${table.accessCode}`)
            .then(res => {
                const total = res.data.data
                console.log("Total Requested",total);
                return total;
            });
    }

}