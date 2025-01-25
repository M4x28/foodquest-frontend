/**
 * Rappresenta una tavola all'interno della pizzeria.
 */
export interface Table {
    accessCode: string,
    sessionCode: string,
    number: number
}

/**
 * Definisce la struttura base di un ingrediente.
 */
export interface Ingredient {
    documentId: string,
    type: string,
    name: string,
    price: number
}

/**
 * Estende la struttura di Ingredient con dettagli aggiuntivi.
 */
export interface DetailIngredient extends Ingredient {
    UIDIngredient: string;
    defaultIngredientBuilding: string;
    full_img_link: string;
    icon_img_link?: string;
    allergens: Allergen[];
    recommended_ingredient: DetailIngredient[];
}

/**
 * Rappresenta un allergene associato a un ingrediente.
 */
export interface Allergen {
    documentId: string,
    name: string
}

/**
 * Base per un prodotto venduto.
 */
export interface Product {
    documentId: string,
    name: string,
    price: number,
    category: Category
}

/**
 * Estende Product con dettagli specifici per un'interfaccia più dettagliata.
 */
export interface DetailProduct extends Product {
    imgUrl?: string,
    ingredientsId?: string[];
    allergensId?: string[];
}

/**
 * Gestisce gli ordini.
 */
export interface Order {
    documentId: string,
    status: string,
    time: number,
    products: Product[];
}

/**
 * Rappresenta una categoria di prodotti.
 */
export interface Category {
    id: string;
    documentId: string;
    name: string;
}

/**
 * Rappresenta una fidelity card di un utente.
 */
export interface FidelityCard {
    documentId: string;
    Points: number;
    UsePoints: boolean | null;
}

// Definisce le dimensioni delle immagini gestite nel server.
export type ImgSize = "thumbnail" | "small" | "medium";

/**
 * Interfaccia principale del server che aggrega tutti i componenti endpoint.
 */
export default interface Server {

    serverUrl: string;

    orders: OrderEndpoint
    table: TableEndpoint
    products: ProductEndpoint
    categories: CategoryEndpoint
    user: UserEndpoint
    fc: FCEndpoint
    ingredient: IngredientEndpoint
    allergen: AllergenEndpoint

    imageUrlFromServer: (url: string, size?: ImgSize) => string
}

/**
 * Interfaccia per la gestione degli ordini.
 */
export interface OrderEndpoint {
    fetchOrdersDone: (table: Table) => Promise<Order[]>
    fetchCurrentOrder: (table: Table) => Promise<Order>
    confirmOrder: (documentID: string, allCoursesTogetherFlag: boolean) => Promise<void>
    removeProductFromOrder: (orderDocumentID: string, productDocumentID: string) => Promise<boolean>
}

/**
 * Interfaccia per le operazioni legate alle tavole.
 */
export interface TableEndpoint {
    logToTable: (accessCode: string) => Promise<Table>
    fetchTableStatus: (table: Table) => Promise<string>
    fetchTotal: (table: Table) => Promise<{ total: number, discount: number }>
    askForCheck: (table: Table) => Promise<void>
}

/**
 * Interfaccia per la gestione dei prodotti.
 */
export interface ProductEndpoint {
    addProductToCart: (table: Table, productId: string, userID?: string) => Promise<void>
    getProductIngredients: (productId: string) => Promise<DetailIngredient[]>
    createCustomProductFromIngredients: (table: Table, categoryID: string, baseID: string, ingredientsID: string[]) => Promise<string>
}

/**
 * Interfaccia per la gestione delle categorie.
 */
export interface CategoryEndpoint {
    fetchCategoriesIdAndName: () => Promise<Category[]>
    fetchProductByCategory: (categoryId: string) => Promise<{ products: DetailProduct[], hasIg: boolean }>
    fetchCatergoryDetail: (categoryId: string) => Promise<{ documentId: string, name: string }>
    getPizzaCategoryId: () => Promise<string | undefined>
}

/**
 * Interfaccia per la gestione degli utenti.
 */
export interface UserEndpoint {
    register: (username: string, email: string, password: string) => Promise<any>
    login: (identifier: string, password: string) => Promise<any>
}

/**
 * Interfaccia per la gestione delle fidelity card.
 */
export interface FCEndpoint {
    fetchUserFC:(userID: string) => Promise<FidelityCard>
    setPointUsage: (userID: string, isUsingPoint: boolean) => Promise<void>
    addFidelityPoints:(userID: string, productIDs: string[]) => Promise<void>
    calculateTableDiscount:(tableNumber: number) => Promise<number>
    createFidelityCard:(userID: string) => Promise<FidelityCard>
    deleteFidelityCard:(userID: string) => Promise<void>
    resetPoints:(users: string[]) => Promise<void>
}

/**
 * Interfaccia per le operazioni legate agli ingredienti.
 */
export interface IngredientEndpoint {
    fetchIngredient: () => Promise<Ingredient[]>
    getIngredientsUsingFilter: (filter: string, type: string, other?: string) => Promise<DetailIngredient[]>
    getBaseIngredients: () => Promise<DetailIngredient[]>
    getExtraIngredients: () => Promise<DetailIngredient[]>
    getDefaultBaseIngredient: () => Promise<DetailIngredient[]>
    getDefaultExtraIngredient: () => Promise<DetailIngredient[]>
}

/**
 * Interfaccia per le operazioni legate agli allergeni.
 */
export interface AllergenEndpoint {
    fetchAllergen: () => Promise<Allergen[]>
}