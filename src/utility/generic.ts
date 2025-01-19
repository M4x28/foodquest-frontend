import { DetailProduct, Product } from "../server/server";

export const stopPropagation = (e) => {
    e.stopPropagation();
}

export const formatPrice = (price:number):string => {
    if(isNaN(price)){
        return "Nan"
    }
    return price.toFixed(2)
}

export const toErrorPage = (navigator) => {
    navigator("/error");
}

export interface productsWithQuantity extends DetailProduct {
    quantity:number
}

export const countProduct = (products:Product[]):productsWithQuantity[] => {
    
    const productMap: { [key: string]: productsWithQuantity } = {};

    products.forEach((p) => {
        if (productMap[p.documentId]) {
            productMap[p.documentId].quantity += 1;
        } else {
            productMap[p.documentId] = { ...p, quantity: 1 };
        }
    });

    return Object.values(productMap);
}

export const FULL_IMG_PATH = "/ingredients/full_img/";
export const ICON_IMG_PATH = "/ingredients/icon_img/";
export const DEFAULT_IMG_FORMAT = ".svg";