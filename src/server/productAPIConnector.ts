import axios from "axios";
import { ingredient, ProductEndpoint,table } from "./server";
import { DEFAULT_IMG_FORMAT, FULL_IMG_PATH, ICON_IMG_PATH } from "../utility/generic.ts";

export default class StrapiProductAPI implements ProductEndpoint{

    private __serverUrl__:string;

    constructor(serverUrl:string){
        this.__serverUrl__ = serverUrl;
    }

    addProductToCart(table: table, productId: string):Promise<void>{
        return axios.post(`${this.__serverUrl__}/api/partial-orders`,{ data: {
            productID: productId,
            accessCode: table.accessCode,
            sessionCode: table.sessionCode
        }})
    };

    async getProductIngredients(productId: string): Promise<ingredient[]> {
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