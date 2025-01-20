import { DetailProduct, Product } from "../server/server";

// Funzione per interrompere la propagazione dell'evento
export const stopPropagation = (e) => {
    e.stopPropagation();
}

/**
 * Formatta un prezzo in una stringa con due decimali.
 * 
 * @param {number} price - Prezzo da formattare.
 * @returns {string} Prezzo formattato o "Nan" se il valore non è valido.
 */
export const formatPrice = (price: number): string => {
    if (isNaN(price)) {
        return "Nan"; // Restituisce "Nan" se il valore non è un numero
    }
    return price.toFixed(2); // Formatta il numero a due decimali
}

/**
 * Reindirizza alla pagina di errore utilizzando il navigatore.
 * 
 * @param {function} navigator - Funzione per la navigazione.
 */
export const toErrorPage = (navigator) => {
    navigator("/error"); // Reindirizza l'utente alla pagina "/error"
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
    // Mappa per tracciare i prodotti e le loro quantità
    const productMap: { [key: string]: productsWithQuantity } = {};

    // Itera su ogni prodotto nella lista
    products.forEach((p) => {
        if (productMap[p.documentId]) {
            // Incrementa la quantità se il prodotto è già nella mappa
            productMap[p.documentId].quantity += 1;
        } else {
            // Aggiunge il prodotto alla mappa con quantità iniziale pari a 1
            productMap[p.documentId] = { ...p, quantity: 1 };
        }
    });

    // Restituisce i valori della mappa come array
    return Object.values(productMap);
}

// Percorso completo per le immagini degli ingredienti
export const FULL_IMG_PATH = "/ingredients/full_img/";

// Percorso per le icone degli ingredienti
export const ICON_IMG_PATH = "/ingredients/icon_img/";

// Formato immagine predefinito
export const DEFAULT_IMG_FORMAT = ".svg";