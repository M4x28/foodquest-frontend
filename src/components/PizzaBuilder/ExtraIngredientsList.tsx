import React from "react";
import { DetailIngredient } from "../../server/server.ts"; // Import del tipo `DetailIngredient`
import { sortIngredients } from "../../utility/ingredientSorter.ts"; // Import della funzione per ordinare gli ingredienti
import { Button } from "../input/Button.tsx"; // Import del componente `Button`

// Interfaccia per le proprietà accettate dal componente `ExtraIngredientsList`
interface ExtraIngredientsListProps {
    extraIngredients: DetailIngredient[]; // Lista degli ingredienti extra
    handleRemoveIngredient: (ingredientId: string) => void; // Funzione per gestire la rimozione di un ingrediente
}

/**
 * Componente `ExtraIngredientsList`.
 * Visualizza una lista di ingredienti extra con un pulsante per rimuoverli.
 * 
 * @param {DetailIngredient[]} extraIngredients - Lista degli ingredienti extra.
 * @param {Function} handleRemoveIngredient - Funzione per gestire la rimozione di un ingrediente.
 */
const ExtraIngredientsList: React.FC<ExtraIngredientsListProps> = ({
    extraIngredients,
    handleRemoveIngredient,
}) => {
    // Ordina gli ingredienti in ordine crescente usando `sortIngredients`
    const sortedIngredients = sortIngredients(extraIngredients, 'asc');

    return (
        <div
            style={{ maxHeight: "150px", overflowY: "auto" }} // Limita l'altezza del contenitore e abilita lo scroll verticale
            className="container mt-3 pt-2" // Classi CSS per il layout
        >
            {/* Mappa la lista degli ingredienti ordinati */}
            {sortedIngredients.map((ingredient) => (
                <div
                    className="row text-center py-2 px-3"
                    key={ingredient.documentId} // Chiave unica per React
                >
                    {/* Colonna con il pulsante per rimuovere l'ingrediente */}
                    <div className="col-2">
                        <Button
                            variant="outline-danger" // Stile del pulsante
                            size="sm" // Dimensione del pulsante
                            className="rounded-circle" // Forma rotonda
                            onClick={() => handleRemoveIngredient(ingredient.documentId)} // Gestisce il click per rimuovere l'ingrediente
                        >
                            - {/* Testo del pulsante */}
                        </Button>
                    </div>

                    {/* Colonna con il nome dell'ingrediente */}
                    <div className="col-8 d-flex align-items-center justify-content-center">
                        <h5 className="text-LG">{ingredient.name}</h5> {/* Nome dell'ingrediente */}
                    </div>

                    {/* Colonna con il prezzo dell'ingrediente */}
                    <div className="col-2 d-flex align-items-center justify-content-center">
                        <h5 className="text-LG">{ingredient.price.toFixed(2)}</h5> {/* Prezzo formattato */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExtraIngredientsList;