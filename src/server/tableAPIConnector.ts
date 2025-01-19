import axios from "axios";
import { TableEndpoint,Table } from "./server.ts";

export default class StrapiTableEndpoint implements TableEndpoint{

    private __endpoint__:string;

    constructor(serverUrl:string){
        this.__endpoint__ = serverUrl + "/api/table";
    }

    logToTable(accessCode: string):Promise<Table>{
        return axios.get(`${this.__endpoint__}/access/${accessCode}`)
        .then(res => {
            const table:Table = res.data.data;
            console.log(table)
            return table
        });
    }

    fetchTableStatus(table: Table):Promise<string>{
        return axios.post(`${this.__endpoint__}/status`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
            }
        }).then((res) => res.data);
    }

    askForCheck (table: Table):Promise<void>{
        return axios.post(`${this.__endpoint__}/checkRequest`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
            }
        });
    };

    fetchTotal (table: Table) :Promise<{ total: number; discount: number; }>{
        return axios.get(`${this.__endpoint__}/total/${table.accessCode}`)
            .then(res => {
                const total = res.data.data
                console.log("Total Requested",total);
                return total;
            });
    }

}