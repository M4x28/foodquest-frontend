import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { FCEndpoint, FidelityCard } from "./server";

// Classe per gestire le operazioni relative alle fidelity card tramite API Strapi
export default class StrapiFCAPI implements FCEndpoint {

    // Endpoint base per le operazioni sulle fidelity card
    private __endpoint__: string;

    /**
     * Costruttore per inizializzare l'endpoint delle fidelity card.
     * 
     * @param {string} serverUrl - URL del server Strapi.
     */
    constructor(serverUrl: string) {
        this.__endpoint__ = serverUrl + "/api/fidelity-card"; // Imposta l'endpoint
    }

    /**
     * Recupera la fidelity card di un utente specifico.
     * 
     * @param {string} userID - ID dell'utente.
     * @returns {Promise<FidelityCard>} Fidelity card dell'utente.
     */
    async fetchUserFC(userID: string): Promise<FidelityCard> {
        const response = await AxiosSingleton.getInstance().get(`${this.__endpoint__}/${userID}`);
        return response.data.data; // Restituisce i dati della fidelity card
    }

    /**
     * Imposta lo stato di utilizzo dei punti di un utente.
     * 
     * @param {string} userID - ID dell'utente.
     * @param {boolean} isUsingPoint - True se l'utente sta utilizzando i punti, altrimenti false.
     * @returns {Promise<void>} Promise risolta se l'operazione ha successo.
     */
    async setPointUsage(userID: string, isUsingPoint: boolean): Promise<void> {
        const response = await AxiosSingleton.getInstance().put(`${this.__endpoint__}/use-points`, {
            data: {
                users_permissions_user: userID, // ID dell'utente
                usePoints: isUsingPoint,       // Stato di utilizzo dei punti
            },
        });
        return response.data;
    }

    /**
     * Aggiunge punti fedeltà a un utente in base ai prodotti acquistati.
     * 
     * @param {string} userID - ID dell'utente.
     * @param {string[]} productIDs - Array di ID dei prodotti acquistati.
     * @returns {Promise<void>} Promise risolta se l'operazione ha successo.
     */
    async addFidelityPoints(userID: string, productIDs: string[]): Promise<void> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/add-points`, {
            data: {
                users_permissions_user: userID, // ID dell'utente
                productIDs: productIDs,        // Array di ID dei prodotti
            },
        });
        return response.data;
    }

    /**
     * Calcola lo sconto totale per un tavolo specifico in base agli utenti associati.
     * 
     * @param {number} tableNumber - Numero del tavolo.
     * @returns {Promise<number>} Valore dello sconto totale calcolato.
     */
    async calculateTableDiscount(tableNumber: number): Promise<number> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/calculate-discount`, {
            data: {
                number: tableNumber, // Numero del tavolo
            },
        });
        return response.data.discount; // Restituisce lo sconto calcolato
    }

    /**
     * Crea una nuova fidelity card per un utente specifico.
     * 
     * @param {string} userID - ID dell'utente.
     * @returns {Promise<FidelityCard>} Fidelity card creata.
     */
    async createFidelityCard(userID: string): Promise<FidelityCard> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/create`, {
            users_permissions_user: userID, // ID dell'utente
        });
        return response.data.data; // Restituisce i dati della fidelity card creata
    }

    /**
     * Elimina la fidelity card di un utente specifico.
     * 
     * @param {string} userID - ID dell'utente.
     * @returns {Promise<void>} Promise risolta se l'operazione ha successo.
     */
    async deleteFidelityCard(userID: string): Promise<void> {
        const response = await AxiosSingleton.getInstance().delete(`${this.__endpoint__}/delete`, {
            data: {
                users_permissions_user: userID, // ID dell'utente
            },
        });
        return response.data;
    }

    /**
     * Resetta i punti fedeltà di un array di utenti a 0 se `UsePoints` è impostato a 1.
     * 
     * @param {string[]} users - Array di ID degli utenti.
     * @returns {Promise<void>} Promise risolta se l'operazione ha successo.
     */
    async resetPoints(users: string[]): Promise<void> {
        const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/reset-points`, {
            data: {
                users_permissions_user: users, // Array di ID degli utenti
            },
        });
        return response.data;
    }
}