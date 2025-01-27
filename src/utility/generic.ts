import { DetailProduct, Product } from "../server/server";

// Helper event handler that stop event bubbling
export const stopPropagation = (e) => {
    e.stopPropagation();
}

//Create a submit handler that stop default handler from executing
export const handleSubmitFactory = (handler: (e:React.SyntheticEvent<HTMLFormElement>) => void) => {
    
    return (e:React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        handler(e);
    }
}

/**
 * Formatta un prezzo in una stringa con due decimali.
 * 
 * @param {number} price - Prezzo da formattare.
 * @returns {string} Prezzo formattato o "Nan" se il valore non è valido.
 */
export const formatPrice = (price: number): string => {
    if (isNaN(price)) {
        return "Nan";
    }
    return price.toFixed(2); 
}

/**
 * Reindirizza alla pagina di errore utilizzando il navigatore.
 * 
 * @param {function} navigator - Funzione per la navigazione.
 */
export const toErrorPage = (navigator) => {
    // Check if not already on error page
    if(window.location.pathname != "/error"){
        navigator("/error");
    }
}

// Interfaccia che estende `DetailProduct` con una proprietà `quantity`
export interface productsWithQuantity extends DetailProduct {
    quantity: number; // Quantità del prodotto
}

/**
 * Conta la quantità di ciascun prodotto in una lista di prodotti.
 * 
 * @param {Product[]} products - Array di prodotti da elaborare.
 * @returns {productsWithQuantity[]} Array di prodotti con quantità incluse.
 */
export const countProduct = (products: Product[]): productsWithQuantity[] => {
    // Product map for counting
    const productMap: { [key: string]: productsWithQuantity } = {};

    products.forEach((p) => {
        if (productMap[p.documentId]) {
            productMap[p.documentId].quantity += 1;             //Update existing product
        } else {
            productMap[p.documentId] = { ...p, quantity: 1 };   //Add prod to map
        }
    });

    // Return Map Values as Array
    return Object.values(productMap);
}

// Percorso completo per le immagini degli ingredienti
export const FULL_IMG_PATH = "/ingredients/full_img/";

// Percorso per le icone degli ingredienti
export const ICON_IMG_PATH = "/ingredients/icon_img/";

// Formato immagine predefinito
export const DEFAULT_IMG_FORMAT = ".svg";