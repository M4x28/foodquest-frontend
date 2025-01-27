import axios, { AxiosInstance } from 'axios';

/**
 * Classe AxiosSingleton per gestire un'istanza singleton di Axios.
 * Impedisce la creazione di multiple istanze di Axios nel progetto, garantendo
 * che tutte le richieste API utilizzino la stessa configurazione di base.
 */
class AxiosSingleton {
    // Proprietà statica che tiene traccia dell'istanza di Axios.
    private static instance: AxiosInstance;

    /**
     * Costruttore privato per impedire l'istanziazione esterna
     * della classe tramite l'operatore 'new'.
     */
    private constructor() { }

    /**
     * Metodo statico per accedere all'istanza di Axios.
     * Crea l'istanza se non esiste, altrimenti ritorna quella esistente.
     * @returns {AxiosInstance} L'istanza configurata di Axios.
     */
    public static getInstance(): AxiosInstance {
        if (!AxiosSingleton.instance) {
            AxiosSingleton.instance = axios.create({
                // URL base per tutte le richieste API
                baseURL: process.env.API_BASE_URL,
                // Headers di default per tutte le richieste
                headers: {
                    "Content-Type": "application/json",
                },
                // Timeout di default per le richieste
                timeout: 10000,
            });

            // Aggiunta di intercettori di richiesta per modificare le richieste prima che vengano inviate
            AxiosSingleton.instance.interceptors.request.use(request => {
                // Inserisci log o modifica la richiesta qui
                //console.log(request);
                return request;
            });

            // Aggiunta di intercettori di risposta per gestire le risposte globalmente
            AxiosSingleton.instance.interceptors.response.use(response => {
                // Gestione delle risposte
                //console.log(request);
                return response;
            }, error => {
                // Gestione degli errori
                return Promise.reject(error);
            });
        }
        return AxiosSingleton.instance;
    }
}

// Esporta la classe per essere utilizzata in altre parti dell'applicazione
export default AxiosSingleton;