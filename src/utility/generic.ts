export const stopPropagation = (e) => {
    e.stopPropagation();
}

export const formatPrice = (price:number):string => {
    if(isNaN(price)){
        return "Nan"
    }

    return price.toFixed(2)
}