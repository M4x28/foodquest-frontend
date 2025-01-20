import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { Allergen, AllergenEndpoint } from "./server.ts";

/**
 * Classe per gestire le richieste API relative agli allergeni.
 */
export default class StrapiAllergenAPI implements AllergenEndpoint {
    private __serverUrl__: string;

    /**
     * Costruttore per inizializzare l'URL base dell'endpoint API.
     * @param serverUrl URL base del server API.
     */
    constructor(serverUrl: string) {
        this.__serverUrl__ = serverUrl + "/api/allergens";
    }

    /**
     * Recupera tutti gli allergeni disponibili.
     * @returns Una promessa che si risolve in un array di oggetti Allergen.
     */
    async fetchAllergen(): Promise<Allergen[]> {
        const allergens: Allergen[] = await AxiosSingleton.getInstance().get(this.__serverUrl__)
            .then((res) => res.data.data.map(a => ({
                documentId: a.documentId,
                name: a.Name
            })));

        return allergens;
    }
}