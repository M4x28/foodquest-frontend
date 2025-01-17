import axios from "axios";
import { ProductEndpoint,table } from "./server";

export default class StrapiProductAPI implements ProductEndpoint{

    private __serverUrl__:string;

    constructor(serverUrl:string){
        this.__serverUrl__ = serverUrl;
    }

    addProductToCart(table: table, productId: string):Promise<void>{
        return axios.post(`${this.__serverUrl__}/api/partial-orders`,{ data: {
            productID: productId,
            accessCode: table.accessCode,
            sessionCode: table.sessionCode
        }})
    };
}