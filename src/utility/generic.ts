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

export const FULL_IMG_PATH = "/ingredients/full_img/";
export const ICON_IMG_PATH = "/ingredients/icon_img/";
export const DEFAULT_IMG_FORMAT = ".svg";