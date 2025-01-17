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

    fetchTableStatus: (table:table) => Promise<string>
    
    fetchOrdersDone: (table:table) => Promise<order[]>
    fetchTotal: (table:table) => Promise<{total:number,discount:number}>
    askForCheck: (table:table) => Promise<void>
    
    fetchIngredient: () => Promise<ingredient[]>
    fetchAllergen: () => Promise<allergen[]>
    fetchProductByCategory: (categoryId:string) => Promise<{name:string,products:detailProduct[],hasIg:boolean}>
    addProductToCart: (table:table, productId: string) => Promise<void>

    fetchCategoriesIdAndName: () => Promise<Category[]>

    imageUrlFromServer: (url:string,size?:ImgSize) => string
}