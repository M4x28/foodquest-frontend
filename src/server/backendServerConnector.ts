import Server, {
    AllergenEndpoint,
    CategoryEndpoint,
    FCEndpoint,
    ImgSize,
    IngredientEndpoint,
    OrderEndpoint,
    ProductEndpoint,
    TableEndpoint,
    UserEndpoint
} from "./server";

import StrapiIngredientAPI from "./ingredientAPIConnector.ts";
import StrapiAllergenAPI from "./allergenAPIConnector.ts";
import StrapiCategoryAPI from "./categoryAPIConnector.ts";
import StrapiTableEndpoint from "./tableAPIConnector.ts";
import StrapiProductAPI from "./productAPIConnector.ts";
import StrapiOrderAPI from "./orderAPIConnector.ts";
import StrapiUserAPI from "./userAPIConnector.ts";
import StrapiFCAPI from "./FCAPIConnector.ts";

// URL predefinito del server Strapi
const DEFAULT_URL: string = "http://localhost:1337";

export default class StrapiServerConnector implements Server {
    private __serverUrl__: string; // URL del server

    // Endpoint specifici per le diverse risorse
    private __category__: CategoryEndpoint;
    private __table__: TableEndpoint;
    private __order__: OrderEndpoint;
    private __products__: ProductEndpoint;
    private __user__: UserEndpoint;
    private __fc__: FCEndpoint;
    private __ingredient__: IngredientEndpoint;
    private __allergen__: AllergenEndpoint;

    /**
     * Costruttore per inizializzare il connettore del server Strapi con un URL specificato.
     * 
     * @param {string} url - URL del server Strapi. Default: `DEFAULT_URL`.
     */
    constructor(url: string = DEFAULT_URL) {
        this.__serverUrl__ = url; // Imposta l'URL del server
        this.__category__ = new StrapiCategoryAPI(url); // Inizializza l'endpoint delle categorie
        this.__table__ = new StrapiTableEndpoint(url);  // Inizializza l'endpoint dei tavoli
        this.__order__ = new StrapiOrderAPI(url);       // Inizializza l'endpoint degli ordini
        this.__products__ = new StrapiProductAPI(url);  // Inizializza l'endpoint dei prodotti
        this.__user__ = new StrapiUserAPI(url);         // Inizializza l'endpoint degli utenti
        this.__fc__ = new StrapiFCAPI(url);             // Inizializza l'endpoint della fidelity card
        this.__ingredient__ = new StrapiIngredientAPI(url); // Inizializza l'endpoint degli ingredienti
        this.__allergen__ = new StrapiAllergenAPI(url);     // Inizializza l'endpoint degli allergeni
    }

    // Getter per accedere all'endpoint delle categorie
    get categories() {
        return this.__category__;
    }

    // Getter per accedere all'endpoint dei tavoli
    get table() {
        return this.__table__;
    }

    // Getter per accedere all'endpoint dei prodotti
    get products() {
        return this.__products__;
    }

    // Getter per accedere all'endpoint degli ordini
    get orders() {
        return this.__order__;
    }

    // Getter per accedere all'endpoint degli utenti
    get user() {
        return this.__user__;
    }

    // Getter per accedere all'endpoint della fidelity card
    get fc() {
        return this.__fc__;
    }

    // Getter per accedere all'endpoint degli ingredienti
    get ingredient() {
        return this.__ingredient__;
    }

    // Getter per accedere all'endpoint degli allergeni
    get allergen() {
        return this.__allergen__;
    }

    // Getter per ottenere l'URL del server
    get serverUrl(): string {
        return this.__serverUrl__;
    }

    /**
     * Costruisce l'URL completo per le immagini dal server Strapi.
     * 
     * @param {string} url - Nome del file immagine.
     * @param {ImgSize} [size] - (Opzionale) Dimensione dell'immagine (es. "small", "medium").
     * @returns {string} URL completo dell'immagine.
     */
    imageUrlFromServer(url: string, size?: ImgSize): string {
        return `${this.__serverUrl__}/uploads/${size ? size + "_" : ""}${url}`;
    }
}