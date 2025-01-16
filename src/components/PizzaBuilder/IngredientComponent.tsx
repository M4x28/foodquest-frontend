import React from "react";
import "../../bootstrap.css";
import { Allergen } from "./AllergenComponent.tsx";
import { getDefaultBaseIngredient, getDefaultExtraIngredient } from "../../services/ingredientService.ts";

export interface Ingredient {
    documentId: string;
    UIDIngredient: string;
    name: string;
    price: number;
    type: string;
    defaultIngredientBuilding: string;
    full_img_link: string;
    icon_img_link?: string;
    allergens: Allergen[];
}

// Definisci gli ingredienti di base di ogni pizza
export const initialBaseIngredient = await getDefaultBaseIngredient();
export const defaultIngredients = await getDefaultExtraIngredient();

// Filtra la mozzarella per la base
export const mozzarella: Ingredient = defaultIngredients.find(
    (ingredient) => ingredient.name.toLowerCase().includes('mozzarella')
) || (() => { throw new Error("Mozzarella non trovata!"); })();

// Filtra la salsa di pomodoro per la base
export const salsaDiPomodoro: Ingredient = defaultIngredients.find(
    (ingredient) => ingredient.name.toLowerCase().includes('salsa di pomodoro')
) || (() => { throw new Error("Salsa di pomodoro non trovata!"); })();

// Funzione per ordinare un array di ingredienti
export const sortIngredients = (ingredients: Ingredient[], order: 'asc' | 'desc') => {
    const orderN = order === 'asc' ? -1 : 1; // Determina l'ordine

    return ingredients.sort((a: Ingredient, b: Ingredient) => {
        // Prima priorità alla salsa di pomodoro
        const isSalsaA = a.name.toLowerCase().includes('salsa');
        const isSalsaB = b.name.toLowerCase().includes('salsa');

        if (isSalsaA && !isSalsaB) return -1 * orderN; // Le salse vengono prima
        if (!isSalsaA && isSalsaB) return 1 * orderN;  // Le salse vengono prima

        // Seconda priorità alla mozzarella
        const isMozzarellaA = a.name.toLowerCase().includes('mozzarella');
        const isMozzarellaB = b.name.toLowerCase().includes('mozzarella');

        if (isMozzarellaA && !isMozzarellaB) return -1 * orderN; // La mozzarella viene dopo le salse
        if (!isMozzarellaA && isMozzarellaB) return 1 * orderN;  // La mozzarella viene dopo le salse

        // Ordine alfabetico per i restanti ingredienti
        return a.name.localeCompare(b.name) * orderN;
    });
};