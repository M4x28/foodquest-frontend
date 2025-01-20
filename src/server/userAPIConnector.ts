import { UserEndpoint } from "./server";
import AxiosSingleton from "../utility/AxiosSingleton.ts";

// Classe per gestire le operazioni relative agli utenti tramite API Strapi
export default class StrapiUserAPI implements UserEndpoint {

    // Endpoint per l'autenticazione degli utenti
    private __endpoint__: string;

    /**
     * Costruttore per inizializzare il connettore dell'endpoint utente.
     * 
     * @param {string} serverUrl - URL del server Strapi.
     */
    constructor(serverUrl: string) {
        // Imposta l'endpoint per l'autenticazione degli utenti
        this.__endpoint__ = serverUrl + "/api/auth/local";
    }

    /**
     * Effettua il login di un utente utilizzando email e password.
     * 
     * @param {string} identifier - Identificativo dell'utente (email o username).
     * @param {string} password - Password dell'utente.
     * @returns {Promise<any>} Dati della risposta del server dopo il login.
     * @throws {Error} Se il login fallisce.
     */
    async login(identifier: string, password: string) {
        try {
            // Effettua la richiesta POST all'endpoint di login
            const response = await AxiosSingleton.getInstance().post(this.__endpoint__, {
                identifier, // Identificativo utente
                password,   // Password utente
            });
            return response.data; // Restituisce i dati della risposta
        } catch (error) {
            console.error("Login failed:", error); // Logga l'errore in caso di fallimento
            throw error; // Propaga l'errore
        }
    };

    /**
     * Registra un nuovo utente con i dettagli forniti.
     * 
     * @param {string} username - Nome utente.
     * @param {string} email - Email dell'utente.
     * @param {string} password - Password dell'utente.
     * @returns {Promise<any>} Dati della risposta del server dopo la registrazione.
     * @throws {Error} Se la registrazione fallisce.
     */
    async register(username: string, email: string, password: string) {
        try {
            // Effettua la richiesta POST all'endpoint di registrazione
            const response = await AxiosSingleton.getInstance().post(`${this.__endpoint__}/register`, {
                username, // Nome utente
                email,    // Email utente
                password, // Password utente
            });
            return response.data; // Restituisce i dati della risposta
        } catch (error) {
            console.error("Registration failed:", error); // Logga l'errore in caso di fallimento
            throw error; // Propaga l'errore
        }
    }

}