import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { DEFAULT_IMG_FORMAT, FULL_IMG_PATH, ICON_IMG_PATH } from "../utility/generic.ts";
import { Ingredient, DetailIngredient, IngredientEndpoint } from "./server";

/**
 * Classe per gestire le richieste API relative agli ingredienti.
 */
export default class StrapiIngredientAPI implements IngredientEndpoint {
    // URL base dell'endpoint API per gli ingredienti
    private __serverUrl__: string;

    /**
     * Costruttore per inizializzare l'endpoint API.
     * 
     * @param {string} serverUrl - URL base del server API.
     */
    constructor(serverUrl: string) {
        this.__serverUrl__ = serverUrl + "/api/ingredients"; // Imposta l'endpoint base per gli ingredienti
    }

    /**
     * Recupera tutti gli ingredienti disponibili.
     * 
     * @returns {Promise<Ingredient[]>} Array di oggetti `Ingredient`.
     */
    async fetchIngredient(): Promise<Ingredient[]> {
        const ingredients: Ingredient[] = await AxiosSingleton.getInstance()
            .get(this.__serverUrl__) // Effettua una richiesta GET per ottenere tutti gli ingredienti
            .then(res =>
                // Mappa i dati ricevuti nella struttura `Ingredient`
                res.data.data.map(i => ({
                    documentId: i.documentId, // ID del documento
                    type: i.Type,            // Tipo dell'ingrediente
                    name: i.Name,            // Nome dell'ingrediente
                    price: i.Price,          // Prezzo dell'ingrediente
                }))
            );
        return ingredients;
    }

    /**
     * Filtra e recupera gli ingredienti con dettagli in base a specifici criteri.
     * 
     * @param {string} filter - Il filtro da applicare (es. 'Type').
     * @param {string} type - Il valore del filtro (es. 'pizza-base').
     * @param {string} [other] - Parametri aggiuntivi per la query URL.
     * @returns {Promise<DetailIngredient[]>} Array di oggetti `DetailIngredient`.
     */
    async getIngredientsUsingFilter(filter: string, type: string, other?: string): Promise<DetailIngredient[]> {
        if (other === undefined) other = ''; // Imposta un valore vuoto per i parametri opzionali

        // Effettua una richiesta GET con i parametri di filtro
        const response = await AxiosSingleton.getInstance().get(
            `${this.__serverUrl__}?filters[${filter}][$eq]=${type}` +
            other +
            '&populate=allergens&populate[association_rule][populate][recommended_ingredient][populate]=allergens' +
            '&populate[association_rule][populate][recommended_ingredient][fields]=documentId,Name,Price,Type,UIDIngredient,defaultIngredientBuilding'
        );

        // Mappa i dati ricevuti nella struttura `DetailIngredient`
        return response.data.data.map(item => ({
            documentId: item.documentId,                     // ID del documento
            UIDIngredient: item.UIDIngredient,              // UID dell'ingrediente
            name: item.Name,                                 // Nome dell'ingrediente
            price: item.Price,                               // Prezzo dell'ingrediente
            type: item.Type,                                 // Tipo dell'ingrediente
            defaultIngredientBuilding: item.defaultIngredientBuilding, // Flag per indicare se è un ingrediente di default
            full_img_link: FULL_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT), // URL immagine completa
            icon_img_link: ICON_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT), // URL immagine icona
            allergens: item.allergens,                      // Allergeni associati
            recommended_ingredient: item.association_rule?.recommended_ingredient
                ? {
                    documentId: item.association_rule.recommended_ingredient.documentId,
                    UIDIngredient: item.association_rule.recommended_ingredient.UIDIngredient,
                    name: item.association_rule.recommended_ingredient.Name,
                    price: item.association_rule.recommended_ingredient.Price,
                    type: item.association_rule.recommended_ingredient.Type,
                    defaultIngredientBuilding: item.association_rule.recommended_ingredient.defaultIngredientBuilding,
                    full_img_link: FULL_IMG_PATH.concat(item.association_rule.recommended_ingredient.UIDIngredient, DEFAULT_IMG_FORMAT),
                    icon_img_link: ICON_IMG_PATH.concat(item.association_rule.recommended_ingredient.UIDIngredient, DEFAULT_IMG_FORMAT),
                    allergens: item.association_rule.recommended_ingredient.allergens || [] // Allergeni del raccomandato
                }
                : null // Nessun ingrediente raccomandato
        }));
    }

    /**
     * Recupera gli ingredienti base per le pizze.
     * 
     * @returns {Promise<DetailIngredient[]>} Array di ingredienti base per pizza.
     */
    async getBaseIngredients(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('Type', 'pizza-base'); // Filtra per tipo "pizza-base"
    }

    /**
     * Recupera gli ingredienti extra.
     * 
     * @returns {Promise<DetailIngredient[]>} Array di ingredienti extra.
     */
    async getExtraIngredients(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('Type', 'extra'); // Filtra per tipo "extra"
    }

    /**
     * Recupera l'ingrediente base di default.
     * 
     * @returns {Promise<DetailIngredient[]>} Array di ingredienti base di default.
     */
    async getDefaultBaseIngredient(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('defaultIngredientBuilding', 'default', '&filters[Type][$eq]=pizza-base');
    }

    /**
     * Recupera gli ingredienti extra di default.
     * 
     * @returns {Promise<DetailIngredient[]>} Array di ingredienti extra di default.
     */
    async getDefaultExtraIngredient(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('defaultIngredientBuilding', 'default', '&filters[Type][$eq]=extra');
    }
}