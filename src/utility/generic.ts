import { API_BASE_URL } from "./constants.ts";

export const stopPropagation = (e) => {
    e.stopPropagation();
}

type ImgSize = "thumbnail" | "small" | "medium";

export const exdendImgUrl = (url:string,size?:ImgSize):string => {
    
    return `${API_BASE_URL}/uploads/${size ? size + "_" : ""}${url}`;
}

export const formatPrice = (price:number):string => {
    if(isNaN(price)){
        return "Nan"
    }

    return price.toFixed(2)
}