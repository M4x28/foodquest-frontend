import { DetailIngredient } from "../server/server.ts";

/**
 * Ordina un array di ingredienti secondo specifici criteri.
 * @param ingredients Array di ingredienti da ordinare.
 * @param order Specifica se l'ordinamento deve essere ascendente ('asc') o discendente ('desc').
 * @returns Array di ingredienti ordinato.
 */
export function sortIngredients(ingredients: DetailIngredient[], order: 'asc' | 'desc'): DetailIngredient[] {
    const orderN = order === 'asc' ? -1 : 1; // Determina l'ordine

    return ingredients.sort((a: DetailIngredient, b: DetailIngredient) => {
        // Controllo per basilico e burrata
        const isBasilicoA = a.name.toLowerCase().includes('basilico');
        const isBasilicoB = b.name.toLowerCase().includes('basilico');
        const isBurrataA = a.name.toLowerCase().includes('burrata');
        const isBurrataB = b.name.toLowerCase().includes('burrata');

        if ((isBasilicoA || isBurrataA) && !(isBasilicoB || isBurrataB)) return 1 * orderN;
        if (!(isBasilicoA || isBurrataA) && (isBasilicoB || isBurrataB)) return -1 * orderN;

        // Prima priorità alla salsa di pomodoro
        const isSalsaA = a.name.toLowerCase().includes('salsa');
        const isSalsaB = b.name.toLowerCase().includes('salsa');
        if (isSalsaA && !isSalsaB) return -1 * orderN;
        if (!isSalsaA && isSalsaB) return 1 * orderN;

        // Seconda priorità alla mozzarella
        const isMozzarellaA = a.name.toLowerCase().includes('mozzarella');
        const isMozzarellaB = b.name.toLowerCase().includes('mozzarella');
        if (isMozzarellaA && !isMozzarellaB) return -1 * orderN;
        if (!isMozzarellaA && isMozzarellaB) return 1 * orderN;

        // Ordine alfabetico per i restanti ingredienti
        return a.name.localeCompare(b.name) * orderN;
    });
}