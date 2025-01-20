import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { TableEndpoint, Table } from "./server.ts";

// Classe per gestire le operazioni relative ai tavoli tramite API Strapi
export default class StrapiTableEndpoint implements TableEndpoint {

    // Endpoint base per l'accesso ai dati dei tavoli
    private __endpoint__: string;

    /**
     * Costruttore per inizializzare il connettore dell'endpoint tavoli.
     * 
     * @param {string} serverUrl - URL del server Strapi.
     */
    constructor(serverUrl: string) {
        this.__endpoint__ = serverUrl + "/api/table"; // Imposta l'endpoint per i tavoli
    }

    /**
     * Accede a un tavolo tramite il codice di accesso fornito.
     * 
     * @param {string} accessCode - Codice di accesso al tavolo.
     * @returns {Promise<Table>} Dati del tavolo ottenuti dal server.
     */
    logToTable(accessCode: string): Promise<Table> {
        return AxiosSingleton.getInstance()
            .get(`${this.__endpoint__}/access/${accessCode}`) // Effettua una richiesta GET all'endpoint di accesso
            .then(res => {
                const table: Table = res.data.data; // Estrae i dati del tavolo dalla risposta
                console.log(table); // Logga i dettagli del tavolo
                return table; // Restituisce i dati del tavolo
            });
    }

    /**
     * Recupera lo stato di un tavolo specifico.
     * 
     * @param {Table} table - Dati del tavolo (accessCode e sessionCode inclusi).
     * @returns {Promise<string>} Stato del tavolo (es. "OK", "EXPIRED", "CHECK").
     */
    fetchTableStatus(table: Table): Promise<string> {
        return AxiosSingleton.getInstance()
            .post(`${this.__endpoint__}/status`, {
                data: {
                    accessCode: table.accessCode,    // Codice di accesso del tavolo
                    sessionCode: table.sessionCode, // Codice di sessione del tavolo
                }
            })
            .then((res) => res.data); // Restituisce lo stato del tavolo dalla risposta
    }

    /**
     * Richiede il conto per un tavolo specifico.
     * 
     * @param {Table} table - Dati del tavolo (accessCode e sessionCode inclusi).
     * @returns {Promise<void>} Promise risolta se la richiesta va a buon fine.
     */
    askForCheck(table: Table): Promise<void> {
        return AxiosSingleton.getInstance()
            .post(`${this.__endpoint__}/checkRequest`, {
                data: {
                    accessCode: table.accessCode,    // Codice di accesso del tavolo
                    sessionCode: table.sessionCode, // Codice di sessione del tavolo
                }
            });
    }

    /**
     * Recupera il totale e lo sconto applicato per un tavolo.
     * 
     * @param {Table} table - Dati del tavolo (accessCode incluso).
     * @returns {Promise<{ total: number; discount: number; }>} Totale e sconto associati al tavolo.
     */
    fetchTotal(table: Table): Promise<{ total: number; discount: number; }> {
        return AxiosSingleton.getInstance()
            .get(`${this.__endpoint__}/total/${table.accessCode}`) // Effettua una richiesta GET per il totale
            .then(res => {
                const total = res.data.data; // Estrae i dati relativi al totale e allo sconto
                //console.log("Total Requested", total);
                return total; // Restituisce il totale e lo sconto
            });
    }
}