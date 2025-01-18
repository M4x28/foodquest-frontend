import axiosInstance from "../utility/axiosInstance.ts";
import { ENDPOINTS } from "../utility/constants.ts";
import { backendServer } from "../App.tsx";

export const createCustomProductFromIngredients = async (appState: any, categoryID: string, baseID: string, ingredientsID: string[]): Promise<string> => {
    const response = await axiosInstance.post(ENDPOINTS.PRODUCT.POST_PRODUCT, {
        table: {
            accessCode: appState.table.accessCode,
            sessionCode: appState.table.sessionCode
        },
        product: {
            categoryID: categoryID,
            baseID: baseID,
            ingredientsID: ingredientsID
        }
    });

    return response.data.data.id;
};

export async function getPizzaCategoryId() {
    // Fetch delle categorie
    const categories = await backendServer.categories.fetchCategoriesIdAndName();

    // Filtra la categoria con nome 'pizza' (ignora maiuscole/minuscole)
    const pizzaCategory = categories.find(
        (category) => category.name.toLowerCase() === "pizza"
    );

    // Restituisci solo il documentId, oppure undefined se non trovato
    return pizzaCategory ? pizzaCategory.documentId : undefined;
}