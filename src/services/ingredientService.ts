import { Ingredient } from "../components/PizzaBuilder/IngredientComponent.tsx";
import axiosInstance from "../utility/axiosInstance.ts";
import { ENDPOINTS } from "../utility/constants.ts";
import { DEFAULT_IMG_FORMAT, FULL_IMG_PATH, ICON_IMG_PATH } from "../utility/generic.ts";

export const getIngredientsUsingFilter = async (filter: string, type: string, other?: string): Promise<Ingredient[]> => {
    if (other === undefined) other = '';

    const response = await axiosInstance.get(ENDPOINTS.INGREDIENTS.GET_INGREDIENTS.concat('?filters[', filter, '][$eq]=', type, other));
    return response.data.data.map((item: any) => ({
        documentId: item.documentId,
        UIDIngredient: item.UIDIngredient,
        name: item.Name,
        price: item.Price,
        type: item.Type,
        defaultIngredientBuilding: item.defaultIngredientBuilding,
        full_img_link: FULL_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT),
        icon_img_link: ICON_IMG_PATH.concat(item.UIDIngredient, DEFAULT_IMG_FORMAT)
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