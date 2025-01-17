import { Ingredient } from "../components/PizzaBuilder/IngredientComponent.tsx";
import axiosInstance from "../utility/axiosInstance.ts";
import { ENDPOINTS } from "../utility/constants.ts";
import { DEFAULT_IMG_FORMAT, FULL_IMG_PATH, ICON_IMG_PATH } from "../utility/generic.ts";

export const getIngredientsUsingFilter = async (filter: string, type: string, other?: string): Promise<Ingredient[]> => {
    if (other === undefined) other = '';

    const response = await axiosInstance.get(ENDPOINTS.INGREDIENTS.GET_INGREDIENTS.concat('?filters[', filter, '][$eq]=', type,
        '&populate=allergens',
        '&populate[association_rule][populate][recommended_ingredient][populate]=allergens',
        '&populate[association_rule][populate][recommended_ingredient][fields]=documentId,Name,Price,Type,UIDIngredient,defaultIngredientBuilding',
        other));
    return response.data.data.map((item: any) => ({
        documentId: item.documentId,
        UIDIngredient: item.UIDIngredient,
        name: item.Name,
        price: item.Price,
        type: item.Type,
        defaultIngredientBuilding: item.defaultIngredientBuilding,
        full_img_link: FULL_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT),
        icon_img_link: ICON_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT),
        allergens: item.allergens,
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
                allergens: item.association_rule.recommended_ingredient.allergens || [], // Includi allergens o un array vuoto
            }
            : null, // Se non esiste, restituisci null
    }));
};

export const getBaseIngredients = async (): Promise<Ingredient[]> => {
    return getIngredientsUsingFilter('Type', 'pizza-base');
};

export const getExtraIngredients = async (): Promise<Ingredient[]> => {
    return getIngredientsUsingFilter('Type', 'extra');
};

export const getDefaultBaseIngredient = async (): Promise<Ingredient[]> => {
    return getIngredientsUsingFilter('defaultIngredientBuilding', 'default', '&filters[Type][$eq]=pizza-base');
};

export const getDefaultExtraIngredient = async (): Promise<Ingredient[]> => {
    return getIngredientsUsingFilter('defaultIngredientBuilding', 'default', '&filters[Type][$eq]=extra');
};