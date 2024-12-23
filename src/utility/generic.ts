import { backendUrl } from "./constants.ts";

export const stopPropagation = (e) => {
    e.stopPropagation();
}

export const exdendImgUrl = (url:string):string => {
    return `${backendUrl}${url}`;
}