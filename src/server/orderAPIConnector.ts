import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { Category, Order, OrderEndpoint, Table } from "./server";

// Classe per gestire le richieste API relative agli ordini tramite Strapi
export default class StrapiOrderAPI implements OrderEndpoint {

    // Endpoint base per le operazioni sugli ordini
    private __endpoint__: string;

    // Cache per l'ultimo fetch degli ordini
    private lastOrderFetch: string;
    private chachedOrders: Order[];

    // Cache per l'ultimo fetch dell'ordine corrente
    private lastCurrentFetch: string;
    private chachedCurrent: Order;

    /**
     * Costruttore per inizializzare l'endpoint API.
     * 
     * @param {string} serverUrl - URL base del server API.
     */
    constructor(serverUrl: string) {
        this.__endpoint__ = serverUrl + "/api/order"; // Imposta l'endpoint base per gli ordini
    }

    /**
     * Recupera tutti gli ordini completati per un tavolo specifico.
     * 
     * @param {Table} table - Tavolo per cui recuperare gli ordini.
     * @returns {Promise<Order[]>} Array di ordini completati.
     */
    fetchOrdersDone(table: Table): Promise<Order[]> {
        return AxiosSingleton.getInstance().post(`${this.__endpoint__}/get_orders`, {
            data: {
                accessCode: table.accessCode,    // Codice di accesso del tavolo
                sessionCode: table.sessionCode, // Codice di sessione del tavolo
                editedAfter: this.lastOrderFetch, // Timestamp dell'ultimo fetch
            }
        }).then((res) => {
            // Se non ci sono modifiche, restituisce la cache
            if (!res.data.meta.edited) {
                console.log("Order unchanged since", this.lastOrderFetch);
                return this.chachedOrders;
            }

            // Mappa i dati ricevuti in oggetti `Order`
            const orders: Order[] = res.data.data.map(o => {
                const prods: Category[] = o.products.map(p => ({
                    documentId: p.documentId, // ID del documento del prodotto
                    name: p.Name,            // Nome del prodotto
                    price: p.Price,          // Prezzo del prodotto
                    category: {
                        documentId: p.category.documentId, // ID del documento della categoria
                        name: p.category.Name,            // Nome della categoria
                    }
                }));

                return { ...o, products: prods }; // Restituisce l'ordine formattato
            });

            console.log("Order changed", orders);

            // Ordina gli ordini in base allo stato e al tempo
            orders.sort((a, b) => {
                if (a.status === 'Done') return -1;
                if (b.status === 'Done') return 1;
                return a.time - b.time;
            });

            // Aggiorna la cache e il timestamp dell'ultimo fetch
            this.lastOrderFetch = new Date().toISOString();
            this.chachedOrders = orders;

            return orders; // Restituisce gli ordini ordinati
        });
    }

    /**
     * Recupera l'ordine corrente per un tavolo specifico.
     * 
     * @param {Table} table - Tavolo per cui recuperare l'ordine corrente.
     * @returns {Promise<Order>} Ordine corrente.
     */
    fetchCurrentOrder(table: Table): Promise<Order> {
        return AxiosSingleton.getInstance().post(`${this.__endpoint__}/current`, {
            data: {
                accessCode: table.accessCode,    // Codice di accesso del tavolo
                sessionCode: table.sessionCode, // Codice di sessione del tavolo
                editedAfter: this.lastCurrentFetch, // Timestamp dell'ultimo fetch
            }
        }).then(res => {
            // Se non ci sono modifiche, restituisce la cache
            if (!res.data.meta.edited) {
                console.log("Current Order unchanged since", this.lastCurrentFetch);
                return this.chachedCurrent;
            }

            // Mappa i dati ricevuti in un oggetto `Order`
            const order = res.data.data;
            if(!order){
                return undefined;
            }
            const prods = order.products.map(p => ({
                documentId: p.documentId, // ID del documento del prodotto
                name: p.Name,            // Nome del prodotto
                price: p.Price,          // Prezzo del prodotto
                category: {
                    documentId: p.category.documentId, // ID del documento della categoria
                    name: p.category.Name,            // Nome della categoria
                }
            }));

            const formattedOrder: Order = { ...order, products: prods }; // Formatta l'ordine
            console.log("Current Order Changed", formattedOrder);

            // Aggiorna la cache e il timestamp dell'ultimo fetch
            this.chachedCurrent = formattedOrder;
            this.lastCurrentFetch = new Date().toISOString();

            return formattedOrder; // Restituisce l'ordine corrente formattato
        });
    }

    /**
     * Conferma un ordine esistente.
     * 
     * @param {string} documentID - ID del documento dell'ordine.
     * @param {boolean} allCoursesTogetherFlag - Indica se servire tutti i piatti insieme.
     * @returns {Promise<void>} Promise risolta se l'ordine è confermato con successo.
     */
    confirmOrder(documentID: string, allCoursesTogetherFlag: boolean): Promise<void> {
        return AxiosSingleton.getInstance().post(`${this.__endpoint__}/confirm`, {
            data: {
                orderID: documentID,                   // ID dell'ordine
                allCoursesTogetherFlag: allCoursesTogetherFlag // Flag per servire tutti i piatti insieme
            }
        }).then(() => console.log("Order Confirmed"));
    }
}