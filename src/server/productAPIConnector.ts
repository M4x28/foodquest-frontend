import axios from "axios";
import { DetailIngredient, ProductEndpoint,Table } from "./server";
import { DEFAULT_IMG_FORMAT, FULL_IMG_PATH, ICON_IMG_PATH } from "../utility/generic.ts";

export default class StrapiProductAPI implements ProductEndpoint{

    private __serverUrl__:string;

    constructor(serverUrl:string){
        this.__serverUrl__ = serverUrl;
    }

    addProductToCart(table: Table, productId: string, userID?: string):Promise<void>{
        return axios.post(`${this.__serverUrl__}/api/partial-orders`,{ data: {
            productID: productId,
            accessCode: table.accessCode,
            sessionCode: table.sessionCode,
            users_permissions_user: userID
        }})
    };

    async createCustomProductFromIngredients(table:Table, categoryID: string, baseID: string, ingredientsID: string[]):Promise<string>{
        const response = await axios.post(`${this.__serverUrl__}/api/products/create`, {
            table: {
                accessCode: table.accessCode,
                sessionCode: table.sessionCode
            },
            product: {
                categoryID: categoryID,
                baseID: baseID,
                ingredientsID: ingredientsID
            }
        });
    
        return response.data.data.id;
    };

    async getProductIngredients(productId: string): Promise<DetailIngredient[]> {
        return await axios.get(`${this.__serverUrl__}/api/products/ingredient/${productId}`)
            .then(res => {
                const ingredients = res.data.data;

                return ingredients.map((ingredient: any) => ({
                    documentId: ingredient.documentId,
                    UIDIngredient: ingredient.UIDIngredient,
                    name: ingredient.Name,
                    price: ingredient.Price,
                    type: ingredient.Type,
                    defaultIngredientBuilding: ingredient.DefaultIngredientBuilding,
                    full_img_link: FULL_IMG_PATH.concat(ingredient.UIDIngredient, DEFAULT_IMG_FORMAT),
                    icon_img_link: ICON_IMG_PATH.concat(ingredient.UIDIngredient, DEFAULT_IMG_FORMAT),
                    allergens: ingredient.Allergens || [],
                    recommended_ingredient: ingredient.RecommendedIngredient || []
                }));
            });
    }
}