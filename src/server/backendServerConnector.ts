import axios from "axios";
import Server, { allergen, CategoryEndpoint, FCEndpoint, ImgSize, ingredient, OrderEndpoint, ProductEndpoint, TableEndpoint, UserEndpoint } from "./server";
import StrapiCategoryAPI from "./categoryAPIConnector.ts";
import StrapiTableEndpoint from "./tableAPIConnector.ts";
import StrapiOrderAPI from "./orderAPIConnector.ts";
import StrapiProductAPI from "./productAPIConnector.ts";
import StrapiUserAPI from "./userAPIConnector.ts";
import StrapiFCAPI from "./FCAPIConnector.ts";

export default class StrapiServerConnector implements Server{

    private __serverUrl__:string;

    private __category__:CategoryEndpoint;
    private __table__:TableEndpoint;
    private __order__:OrderEndpoint;
    private __products__:ProductEndpoint;
    private __user__:UserEndpoint;
    private __fc__:FCEndpoint;

    constructor(url:string){
        this.__serverUrl__ = url;
        this.__category__ = new StrapiCategoryAPI(url);
        this.__table__ = new StrapiTableEndpoint(url);
        this.__order__ = new StrapiOrderAPI(url);
        this.__products__ = new StrapiProductAPI(url);
        this.__user__ = new StrapiUserAPI(url);
        this.__fc__ = new StrapiFCAPI(url);
    }

    get categories(){
        return this.__category__;
    }

    get table(){
        return this.__table__;
    }

    get products(){
        return this.__products__;
    }

    get orders(){
        return this.__order__;
    }

    get user(){
        return this.__user__;
    }

    get fc(){
        return this.__fc__;
    }

    get serverUrl():string{
        return this.__serverUrl__;
    }

    imageUrlFromServer(url:string,size?:ImgSize):string{
        return `${this.__serverUrl__}/uploads/${size ? size + "_" : ""}${url}`;
    }
    
    async fetchIngredient():Promise<ingredient[]>{
        const ig:ingredient[] = await axios.get(`${this.__serverUrl__}/api/ingredients`)
            .then((res) => res.data.data.map( i => ({
                documentId:i.documentId,
                type:i.Type,
                name:i.Name,
                price:i.Price
            })));
        console.log("Fetched Ingredient",ig);
        return ig;
    }

    async fetchAllergen():Promise<allergen[]>{
        const allergens:allergen[] = await axios.get(`${this.__serverUrl__}/api/allergens`)
            .then((res) => res.data.data.map(a => ({
                documentId: a.documentId,
                name: a.Name
            })));

        console.log("Fetched Allergen",allergens);
        return allergens;
    }
}