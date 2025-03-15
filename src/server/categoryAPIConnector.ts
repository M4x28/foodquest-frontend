import AxiosSingleton from "../utility/AxiosSingleton.ts";
import { Category, CategoryEndpoint, DetailProduct } from "./server.ts";

// Classe per gestire le operazioni relative alle categorie tramite API Strapi
export default class StrapiCategoryAPI implements CategoryEndpoint {

    // Endpoint base per le categorie
    private __endpoint__: string;

    /**
     * Costruttore per inizializzare l'endpoint delle categorie.
     * 
     * @param {string} serverUrl - URL del server Strapi.
     */
    constructor(serverUrl: string) {
        this.__endpoint__ = serverUrl + "/api/categories"; // Imposta l'endpoint per le categorie
    }

    /**
     * Recupera i prodotti associati a una categoria specifica.
     * 
     * @param {string} categoryId - ID della categoria.
     * @returns {Promise<{products: DetailProduct[]; hasIg: boolean}>} Prodotti dettagliati e flag `hasIg` (se hanno ingredienti).
     */
    async fetchProductByCategory(categoryId: string): Promise<{ products: DetailProduct[]; hasIg: boolean }> {
        // Effettua una richiesta per ottenere i dettagli dei prodotti associati alla categoria
        const catDetail = await AxiosSingleton.getInstance().get(`${this.__endpoint__}/all/${categoryId}`)
            .then((res) => {
                const products = res.data.data;

                // Mappa i dati ricevuti per creare una lista di prodotti dettagliati
                const prods: DetailProduct[] = products.map((p) => ({
                    documentId: p.documentId,    // ID del documento del prodotto
                    name: p.Name,               // Nome del prodotto
                    price: p.Price,             // Prezzo del prodotto
                    imgUrl: p.image,            // URL dell'immagine del prodotto
                    ingredientsId: p.ingredients, // ID degli ingredienti associati
                    allergensId: p.allergens,   // ID degli allergeni associati
                }));

                // Verifica se ci sono prodotti con ingredienti associati
                const prodWithIg = prods.filter((p) => p.ingredientsId !== undefined).length;

                return {
                    products: prods,            // Lista di prodotti dettagliati
                    hasIg: prodWithIg !== 0     // Indica se almeno un prodotto ha ingredienti
                };
            });

        console.log("Fetched Product for " + categoryId, catDetail.products);
        return catDetail; // Restituisce i dettagli dei prodotti
    }

    /**
     * Recupera gli ID, i nomi e l'ordine di visualizzazione di tutte le categorie.
     * 
     * @returns {Promise<Category[]>} Array di oggetti `Category` contenenti ID, nome e ordine di visualizzazione delle categorie.
     */
    async fetchCategoriesIdAndName(): Promise<Category[]> {
        const response = await AxiosSingleton.getInstance()
            .get(`${this.__endpoint__}?fields=documentId%2C%20Name%2C%20ShowOrder&sort=ShowOrder:ASC`); // Recupera solo i campi `documentId`, `Name` e `ShowOrder` e ordina per `ShowOrder` in modo crescente
        // Mappa i dati per creare oggetti `Category`
        return response.data.data.map((item: any) => ({
            id: item.id,               // ID della categoria
            documentId: item.documentId, // ID del documento della categoria
            name: item.Name,           // Nome della categoria
            showOrder: item.ShowOrder  // Ordine di visualizzazione della categoria
        }));
    }

    /**
     * Recupera i dettagli di una categoria specifica.
     * 
     * @param {string} categoryId - ID della categoria.
     * @returns {Promise<{ documentId: string; name: string; }>} Dettagli della categoria (ID e nome).
     */
    async fetchCatergoryDetail(categoryId: string): Promise<{ documentId: string; name: string; }> {
        return await AxiosSingleton.getInstance()
            .get(`${this.__endpoint__}/${categoryId}`) // Effettua una richiesta per ottenere i dettagli della categoria
            .then(res => {
                const category = res.data.data;

                console.log(category); // Logga i dettagli della categoria
                return {
                    documentId: category.documentId, // ID del documento della categoria
                    name: category.Name             // Nome della categoria
                };
            });
    }

    /**
     * Recupera l'ID della categoria con nome "pizza".
     * 
     * @returns {Promise<string | undefined>} ID della categoria "pizza", oppure `undefined` se non trovata.
     */
    async getPizzaCategoryId(): Promise<string | undefined> {
        // Recupera tutte le categorie
        const categories = await this.fetchCategoriesIdAndName();

        // Filtra per trovare la categoria con nome "pizza" (case insensitive)
        const pizzaCategory = categories.find(
            (category) => category.name.toLowerCase() === "pizza"
        );

        // Restituisce l'ID del documento della categoria "pizza", oppure `undefined` se non trovata
        return pizzaCategory ? pizzaCategory.documentId : undefined;
    }
}