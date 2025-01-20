import Server, { AllergenEndpoint, CategoryEndpoint, FCEndpoint, ImgSize, IngredientEndpoint, OrderEndpoint, ProductEndpoint, TableEndpoint, UserEndpoint } from "./server";
import StrapiIngredientAPI from "./ingredientAPIConnector.ts";
import StrapiAllergenAPI from "./allergenAPIConnector.ts";
import StrapiCategoryAPI from "./categoryAPIConnector.ts";
import StrapiTableEndpoint from "./tableAPIConnector.ts";
import StrapiProductAPI from "./productAPIConnector.ts";
import StrapiOrderAPI from "./orderAPIConnector.ts";
import StrapiUserAPI from "./userAPIConnector.ts";
import StrapiFCAPI from "./FCAPIConnector.ts";

const DEFAULT_URL: string = "http://localhost:1337";  // URL predefinito

export default class StrapiServerConnector implements Server {
    private __serverUrl__: string;

    private __category__: CategoryEndpoint;
    private __table__: TableEndpoint;
    private __order__: OrderEndpoint;
    private __products__: ProductEndpoint;
    private __user__: UserEndpoint;
    private __fc__: FCEndpoint;
    private __ingredient__: IngredientEndpoint;
    private __allergen__: AllergenEndpoint;

    constructor(url: string = DEFAULT_URL) {
        this.__serverUrl__ = url;
        this.__category__ = new StrapiCategoryAPI(url);
        this.__table__ = new StrapiTableEndpoint(url);
        this.__order__ = new StrapiOrderAPI(url);
        this.__products__ = new StrapiProductAPI(url);
        this.__user__ = new StrapiUserAPI(url);
        this.__fc__ = new StrapiFCAPI(url);
        this.__ingredient__ = new StrapiIngredientAPI(url);
        this.__allergen__ = new StrapiAllergenAPI(url);
    }

    get categories() {
        return this.__category__;
    }

    get table() {
        return this.__table__;
    }

    get products() {
        return this.__products__;
    }

    get orders() {
        return this.__order__;
    }

    get user() {
        return this.__user__;
    }

    get fc() {
        return this.__fc__;
    }

    get ingredient() {
        return this.__ingredient__;
    }

    get allergen() {
        return this.__allergen__;
    }

    get serverUrl(): string {
        return this.__serverUrl__;
    }

    imageUrlFromServer(url: string, size?: ImgSize): string {
        return `${this.__serverUrl__}/uploads/${size ? size + "_" : ""}${url}`;
    }
}