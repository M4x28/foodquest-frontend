import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { DEFAULT_IMG_FORMAT, FULL_IMG_PATH, ICON_IMG_PATH } from "../utility/generic.ts";
import { Ingredient, DetailIngredient, IngredientEndpoint } from "./server";

/**
 * Classe per gestire le richieste API relative agli ingredienti.
 */
export default class StrapiIngredientAPI implements IngredientEndpoint {
    private __serverUrl__: string;

    /**
     * Costruttore per inizializzare l'URL base dell'endpoint API.
     * @param serverUrl URL base del server API.
     */
    constructor(serverUrl: string) {
        this.__serverUrl__ = serverUrl + "/api/ingredients";
    }

    /**
     * Recupera tutti gli ingredienti disponibili.
     * @returns Una promessa che si risolve in un array di oggetti Ingredient.
     */
    async fetchIngredient(): Promise<Ingredient[]> {
        const ingredients: Ingredient[] = await AxiosSingleton.getInstance().get(this.__serverUrl__)
            .then(res => res.data.data.map(i => ({
                documentId: i.documentId,
                type: i.Type,
                name: i.Name,
                price: i.Price,
            })));
        return ingredients;
    }

    /**
     * Filtra e recupera ingredienti con dettagli in base a specifici criteri.
     * @param filter Il filtro da applicare (es. 'Type').
     * @param type Il tipo di ingrediente da filtrare (es. 'pizza-base').
     * @param other Parametri aggiuntivi per la query URL.
     * @returns Una promessa che si risolve con un array di DetailIngredient.
     */
    async getIngredientsUsingFilter(filter: string, type: string, other?: string): Promise<DetailIngredient[]> {
        if (other === undefined) other = '';

        const response = await AxiosSingleton.getInstance().get(`${this.__serverUrl__}?filters[${filter}][$eq]=${type}` + other + '&populate=allergens&populate[association_rule][populate][recommended_ingredient][populate]=allergens&populate[association_rule][populate][recommended_ingredient][fields]=documentId,Name,Price,Type,UIDIngredient,defaultIngredientBuilding');
        return response.data.data.map(item => ({
            documentId: item.documentId,
            UIDIngredient: item.UIDIngredient,
            name: item.Name,
            price: item.Price,
            type: item.Type,
            defaultIngredientBuilding: item.defaultIngredientBuilding,
            full_img_link: FULL_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT),
            icon_img_link: ICON_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT),
            allergens: item.allergens,
            recommended_ingredient: item.association_rule?.recommended_ingredient ? {
                documentId: item.association_rule.recommended_ingredient.documentId,
                UIDIngredient: item.association_rule.recommended_ingredient.UIDIngredient,
                name: item.association_rule.recommended_ingredient.Name,
                price: item.association_rule.recommended_ingredient.Price,
                type: item.association_rule.recommended_ingredient.Type,
                defaultIngredientBuilding: item.association_rule.recommended_ingredient.defaultIngredientBuilding,
                full_img_link: FULL_IMG_PATH.concat(item.association_rule.recommended_ingredient.UIDIngredient, DEFAULT_IMG_FORMAT),
                icon_img_link: ICON_IMG_PATH.concat(item.association_rule.recommended_ingredient.UIDIngredient, DEFAULT_IMG_FORMAT),
                allergens: item.association_rule.recommended_ingredient.allergens || []
            } : null
        }));
    }

    /**
     * Recupera gli ingredienti base per le pizze.
     * @returns Una promessa che si risolve in un array di DetailIngredient.
     */
    async getBaseIngredients(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('Type', 'pizza-base');
    }

    /**
     * Recupera ingredienti extra.
     * @returns Una promessa che si risolve in un array di DetailIngredient.
     */
    async getExtraIngredients(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('Type', 'extra');
    }

    /**
     * Recupera l'ingrediente base di default.
     * @returns Una promessa che si risolve in un array di DetailIngredient.
     */
    async getDefaultBaseIngredient(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('defaultIngredientBuilding', 'default', '&filters[Type][$eq]=pizza-base');
    }

    /**
     * Recupera l'ingredienti extra di default.
     * @returns Una promessa che si risolve in un array di DetailIngredient.
     */
    async getDefaultExtraIngredient(): Promise<DetailIngredient[]> {
        return this.getIngredientsUsingFilter('defaultIngredientBuilding', 'default', '&filters[Type][$eq]=extra');
    }
}
