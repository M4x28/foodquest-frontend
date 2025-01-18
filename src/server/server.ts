export interface table {
    accessCode:string,
    sessionCode:string,
    number:number
}

export interface ingredient{
    documentId:string,
    type:string,
    name:string
    price:number
}

export interface allergen{
    documentId:string,
    name:string
}

export interface product {
    documentId: string,
    name: string,
    price: number 
}

export interface detailProduct extends product{
    imgUrl?:string,
    ingredientsId?: string[];
    allergensId?: string[];
}

export interface order{
    documentId:string,
    status:string,
    time:number,
    products:product[];
}

export interface Category {
    id: string;
    documentId: string;
    name: string;
}

export type ImgSize = "thumbnail" | "small" | "medium";

export default interface Server{

    serverUrl:string;

    orders:OrderEndpoint
    table:TableEndpoint
    products:ProductEndpoint
    categories:CategoryEndpoint
    user:UserEndpoint
    fc:FCEndpoint

    fetchIngredient: () => Promise<ingredient[]>
    fetchAllergen: () => Promise<allergen[]>

    imageUrlFromServer: (url:string,size?:ImgSize) => string
}

export interface OrderEndpoint{
    fetchOrdersDone: (table:table) => Promise<order[]>
}

export interface TableEndpoint{
    fetchTableStatus: (table:table) => Promise<string>
    fetchTotal: (table:table) => Promise<{total:number,discount:number}>
    askForCheck: (table:table) => Promise<void>
}

export interface ProductEndpoint{
    addProductToCart: (table:table, productId: string) => Promise<void>
}

export interface CategoryEndpoint{
    fetchCategoriesIdAndName: () => Promise<Category[]>
    fetchProductByCategory: (categoryId:string) => Promise<{products:detailProduct[],hasIg:boolean}>
    fetchCatergoryDetail: (categoryId:string) => Promise<{documentId:string,name:string}>
}

export interface UserEndpoint{
    register: (username: string, email: string, password: string) => Promise<any>
    login: (identifier: string, password: string) => Promise<any>
}

export interface FCEndpoint{
    fetchMaxPoint: (userID:string) => Promise<number>
    setPointUsage: (userID:string, isUsingPoint:boolean) => Promise<void>
}