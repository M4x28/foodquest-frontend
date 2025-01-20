export interface Table {
    accessCode: string,
    sessionCode: string,
    number: number
}

export interface Ingredient {
    documentId: string,
    type: string,
    name: string
    price: number
}

export interface DetailIngredient extends Ingredient {
    UIDIngredient: string;
    defaultIngredientBuilding: string;
    full_img_link: string;
    icon_img_link?: string;
    allergens: Allergen[];
    recommended_ingredient: DetailIngredient[];
}

export interface Allergen {
    documentId: string,
    name: string
}

export interface Product {
    documentId: string,
    name: string,
    price: number,
    category: Category
}

export interface DetailProduct extends Product {
    imgUrl?: string,
    ingredientsId?: string[];
    allergensId?: string[];
}

export interface Order {
    documentId: string,
    status: string,
    time: number,
    products: Product[];
}

export interface Category {
    id: string;
    documentId: string;
    name: string;
}

export interface FidelityCard {
    documentId: string;
    Points: number;
    UsePoints: boolean | null;
}

export type ImgSize = "thumbnail" | "small" | "medium";

export default interface Server {

    serverUrl: string;

    orders: OrderEndpoint
    table: TableEndpoint
    products: ProductEndpoint
    categories: CategoryEndpoint
    user: UserEndpoint
    fc: FCEndpoint

    fetchIngredient: () => Promise<Ingredient[]>
    fetchAllergen: () => Promise<Allergen[]>

    imageUrlFromServer: (url: string, size?: ImgSize) => string
}

export interface OrderEndpoint {
    fetchOrdersDone: (table: Table) => Promise<Order[]>
    fetchCurrentOrder: (table: Table) => Promise<Order>
    confirmOrder: (documentID: string, allCoursesTogetherFlag: boolean) => Promise<void>
}

export interface TableEndpoint {
    logToTable: (accessCode: string) => Promise<Table>
    fetchTableStatus: (table: Table) => Promise<string>
    fetchTotal: (table: Table) => Promise<{ total: number, discount: number }>
    askForCheck: (table: Table) => Promise<void>
}

export interface ProductEndpoint {
    addProductToCart: (table: Table, productId: string, userID?:string) => Promise<void>
    getProductIngredients: (productId: string) => Promise<DetailIngredient[]>
    createCustomProductFromIngredients: (table:Table, categoryID: string, baseID: string, ingredientsID: string[]) => Promise<string>
}

export interface CategoryEndpoint {
    fetchCategoriesIdAndName: () => Promise<Category[]>
    fetchProductByCategory: (categoryId: string) => Promise<{ products: DetailProduct[], hasIg: boolean }>
    fetchCatergoryDetail: (categoryId: string) => Promise<{ documentId: string, name: string }>
}

export interface UserEndpoint {
    register: (username: string, email: string, password: string) => Promise<any>
    login: (identifier: string, password: string) => Promise<any>
}

export interface FCEndpoint {
    fetchMaxPoint: (userID: string) => Promise<number>
    setPointUsage: (userID: string, isUsingPoint: boolean) => Promise<void>
    addFidelityPoints(userID: string, productIDs: string[]): Promise<void>
    calculateTableDiscount(tableNumber: number): Promise<number>
    createFidelityCard(userID: string): Promise<FidelityCard>
    deleteFidelityCard(userID: string): Promise<void>
    resetPoints(users: string[]): Promise<void>
}