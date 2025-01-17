import axios from "axios";
import { order, table } from "./server";

export default class StrapiOrderAPI{

    private __endpoint__:string;

    constructor(serverUrl:string){
        this.__endpoint__ = serverUrl + "/api/order";
    }

    private lastOrderFetch:string;
    private chachedOrders:order[];

    fetchOrdersDone(table: table):Promise<order[]>{
        return axios.post(`${this.__endpoint__}/get_orders`,{
            data:{
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
                editedAfter: this.lastOrderFetch,
            }
        }).then((res) => {

            if(!res.data.meta.edited){
                console.log("Order unchanged since",this.lastOrderFetch);
                return this.chachedOrders;
            }

            const orders:order[] = res.data.data.map( o => {
                
                const prods = o.products.map(p => ({
                    documentId:p.documentId,
                    name: p.Name,
                    price: p.Price,
                }));

                return {...o, products:prods};
            })
            
            console.log("Order changed",orders);

            //Sort order based on status
            orders.sort((a,b) => {
                if (a.status === 'Done') {
                    return -1;
                }
                if (b.status === 'Done') {
                    return 1;
                }
                return a.time - b.time;
            });

            this.lastOrderFetch = new Date().toISOString();
            this.chachedOrders = orders;

            return orders;
        });
    }
}