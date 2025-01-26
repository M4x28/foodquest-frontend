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
    readonly serverUrl: string; // URL del server

    // Endpoint specifici per le diverse risorse
    readonly categories: CategoryEndpoint;
    readonly table: TableEndpoint;
    readonly orders: OrderEndpoint;
    readonly products: ProductEndpoint;
    readonly user: UserEndpoint;
    readonly fc: FCEndpoint;
    readonly ingredient: IngredientEndpoint;
    readonly allergen: AllergenEndpoint;

    /**
     * Costruttore per inizializzare il connettore del server Strapi con un URL specificato.
     * 
     * @param {string} url - URL del server Strapi. Default: `DEFAULT_URL`.
     */
    constructor(url: string = DEFAULT_URL) {
        this.serverUrl = url; // Imposta l'URL del server
        this.categories = new StrapiCategoryAPI(url); // Inizializza l'endpoint delle categorie
        this.table = new StrapiTableEndpoint(url);  // Inizializza l'endpoint dei tavoli
        this.orders = new StrapiOrderAPI(url);       // Inizializza l'endpoint degli ordini
        this.products = new StrapiProductAPI(url);  // Inizializza l'endpoint dei prodotti
        this.user = new StrapiUserAPI(url);         // Inizializza l'endpoint degli utenti
        this.fc = new StrapiFCAPI(url);             // Inizializza l'endpoint della fidelity card
        this.ingredient = new StrapiIngredientAPI(url); // Inizializza l'endpoint degli ingredienti
        this.allergen = new StrapiAllergenAPI(url);     // Inizializza l'endpoint degli allergeni
    }

    /**
     * Costruisce l'URL completo per le immagini dal server Strapi.
     * 
     * @param {string} url - Nome del file immagine.
     * @param {ImgSize} [size] - (Opzionale) Dimensione dell'immagine (es. "small", "medium").
     * @returns {string} URL completo dell'immagine.
     */
    imageUrlFromServer(url: string, size?: ImgSize): string {
        return `${this.serverUrl}/uploads/${size ? size + "_" : ""}${url}`;
    }
}