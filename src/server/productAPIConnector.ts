import { DetailIngredient, ProductEndpoint, Table } from "./server";
import { DEFAULT_IMG_FORMAT, FULL_IMG_PATH, ICON_IMG_PATH } from "../utility/generic.ts";
import AxiosSingleton from "../utility/AxiosSingleton.ts";

// Classe per gestire le operazioni relative ai prodotti tramite API Strapi
export default class StrapiProductAPI implements ProductEndpoint {

    // URL base del server API
    private __serverUrl__: string;

    /**
     * Costruttore per inizializzare il connettore del prodotto.
     * 
     * @param {string} serverUrl - URL base del server Strapi.
     */
    constructor(serverUrl: string) {
        this.__serverUrl__ = serverUrl; // Imposta l'URL base
    }

    /**
     * Aggiunge un prodotto al carrello associato a un tavolo.
     * 
     * @param {Table} table - Dettagli del tavolo (accessCode e sessionCode inclusi).
     * @param {string} productId - ID del prodotto da aggiungere al carrello.
     * @param {string} [userID] - (Opzionale) ID dell'utente.
     * @returns {Promise<void>} Promise risolta se l'operazione ha successo.
     */
    addProductToCart(table: Table, productId: string, userID?: string): Promise<void> {
        return AxiosSingleton.getInstance().post(`${this.__serverUrl__}/api/partial-orders`, {
            data: {
                productID: productId,            // ID del prodotto da aggiungere
                accessCode: table.accessCode,    // Codice di accesso del tavolo
                sessionCode: table.sessionCode,  // Codice di sessione del tavolo
                users_permissions_user: userID   // (Opzionale) ID dell'utente
            }
        });
    };

    /**
     * Rimuove un prodotto dal carrello associato a un tavolo.
     * 
     * @param {Table} table - Dettagli del tavolo (accessCode e sessionCode inclusi).
     * @param {string} productId - ID del prodotto da rimuovere dal carrello.
     * @param {string} [userID] - (Opzionale) ID dell'utente.
     * @returns {Promise<void>} Promise risolta se l'operazione ha successo.
     */
    removeProductFromCart(table: Table, productId: string, userID?: string): Promise<void> {
        return AxiosSingleton.getInstance().post(`${this.__serverUrl__}/api/partial-orders`, {
            data: {
                productID: productId,            // ID del prodotto da rimuovere
                accessCode: table.accessCode,    // Codice di accesso del tavolo
                sessionCode: table.sessionCode,  // Codice di sessione del tavolo
                users_permissions_user: userID   // (Opzionale) ID dell'utente
            }
        });
    };

    /**
     * Crea un prodotto personalizzato utilizzando ingredienti selezionati.
     * 
     * @param {Table} table - Dettagli del tavolo (accessCode e sessionCode inclusi).
     * @param {string} categoryID - ID della categoria del prodotto.
     * @param {string} baseID - ID della base del prodotto.
     * @param {string[]} ingredientsID - Array di ID degli ingredienti selezionati.
     * @returns {Promise<string>} ID del prodotto personalizzato creato.
     */
    async createCustomProductFromIngredients(table: Table, categoryID: string, baseID: string, ingredientsID: string[]): Promise<string> {
        const response = await AxiosSingleton.getInstance().post(`${this.__serverUrl__}/api/products/create`, {
            table: {
                accessCode: table.accessCode,    // Codice di accesso del tavolo
                sessionCode: table.sessionCode  // Codice di sessione del tavolo
            },
            product: {
                categoryID: categoryID,         // ID della categoria
                baseID: baseID,                 // ID della base del prodotto
                ingredientsID: ingredientsID    // Array di ID degli ingredienti
            }
        });

        return response.data.data.id; // Restituisce l'ID del prodotto creato
    };

    /**
     * Recupera gli ingredienti di un prodotto specifico.
     * 
     * @param {string} productId - ID del prodotto.
     * @returns {Promise<DetailIngredient[]>} Array di ingredienti dettagliati del prodotto.
     */
    async getProductIngredients(productId: string): Promise<DetailIngredient[]> {
        return await AxiosSingleton.getInstance().get(`${this.__serverUrl__}/api/products/ingredient/${productId}`)
            .then(res => {
                const ingredients = res.data.data;

                // Mappa i dati ricevuti in oggetti `DetailIngredient`
                return ingredients.map((ingredient: any) => ({
                    documentId: ingredient.documentId,                   // ID del documento
                    UIDIngredient: ingredient.UIDIngredient,             // UID dell'ingrediente
                    name: ingredient.Name,                               // Nome dell'ingrediente
                    price: ingredient.Price,                             // Prezzo dell'ingrediente
                    type: ingredient.Type,                               // Tipo dell'ingrediente
                    defaultIngredientBuilding: ingredient.DefaultIngredientBuilding, // Flag per indicare se è un ingrediente di default
                    full_img_link: FULL_IMG_PATH.concat(ingredient.UIDIngredient, DEFAULT_IMG_FORMAT), // URL immagine completa
                    icon_img_link: ICON_IMG_PATH.concat(ingredient.UIDIngredient, DEFAULT_IMG_FORMAT), // URL immagine icona
                    allergens: ingredient.Allergens || [],              // Allergeni associati
                    recommended_ingredient: ingredient.RecommendedIngredient || [] // Ingredienti raccomandati
                }));
            });
    };
}