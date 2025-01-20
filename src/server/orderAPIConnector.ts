import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { Category, Order, OrderEndpoint, Table } from "./server";

export default class StrapiOrderAPI implements OrderEndpoint {

    private __endpoint__: string;

    constructor(serverUrl: string) {
        this.__endpoint__ = serverUrl + "/api/order";
    }

    private lastOrderFetch: string;
    private chachedOrders: Order[];

    fetchOrdersDone(table: Table): Promise<Order[]> {
        return AxiosSingleton.getInstance().post(`${this.__endpoint__}/get_orders`, {
            data: {
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
                editedAfter: this.lastOrderFetch,
            }
        }).then((res) => {

            if (!res.data.meta.edited) {
                console.log("Order unchanged since", this.lastOrderFetch);
                return this.chachedOrders;
            }

            const orders: Order[] = res.data.data.map(o => {

                const prods:Category[] = o.products.map(p => ({
                    documentId: p.documentId,
                    name: p.Name,
                    price: p.Price,
                    category: {
                        documentId: p.category.documentId,
                        name: p.category.Name,
                    }
                }));

                return { ...o, products: prods };
            })

            console.log("Order changed", orders);

            //Sort order based on status
            orders.sort((a, b) => {
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

    private lastCurrentFetch: string;
    private chachedCurrent: Order;

    fetchCurrentOrder(table: Table): Promise<Order> {
        return AxiosSingleton.getInstance().post(`${this.__endpoint__}/current`, {
            data: {
                accessCode: table.accessCode,
                sessionCode: table.sessionCode,
                editedAfter: this.lastCurrentFetch,
            }
        }).then(res => {

            if (!res.data.meta.edited) {
                console.log("Current Order unchanged since", this.lastCurrentFetch);
                return this.chachedCurrent;
            }

            const order = res.data.data
            const prods = order.products.map(p => ({
                documentId: p.documentId,
                name: p.Name,
                price: p.Price,
                category: {
                    documentId: p.category.documentId,
                    name: p.category.Name,
                }
            }));

            const formattedOrder:Order = {...order,products:prods};
            console.log("Current Order Changed",formattedOrder);

            this.chachedCurrent = formattedOrder;
            this.lastCurrentFetch = new Date().toISOString();

            return formattedOrder;
        })
    }

    confirmOrder(documentID: string, allCoursesTogetherFlag:boolean): Promise<void> {
        return AxiosSingleton.getInstance().post(`${this.__endpoint__}/confirm`, {
            data: {
                orderID: documentID,
                allCoursesTogetherFlag: allCoursesTogetherFlag
            }
        }).then(() => console.log("Order Confirmed"));
    }

}