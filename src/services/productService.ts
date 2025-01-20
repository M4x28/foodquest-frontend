import { backendServer } from "../App.tsx";

export async function getPizzaCategoryId() {
    // Fetch delle categorie
    const categories = await backendServer.categories.fetchCategoriesIdAndName();

    // Filtra la categoria con nome 'pizza' (ignora maiuscole/minuscole)
    const pizzaCategory = categories.find(
        (category) => category.name.toLowerCase() === "pizza"
    );

    // Restituisci solo il documentId, oppure undefined se non trovato
    return pizzaCategory ? pizzaCategory.documentId : undefined;
}