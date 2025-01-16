import React, { useEffect, useState } from "react";
import { Ingredient } from "./IngredientComponent.tsx";
import { getBaseIngredients } from "../../services/ingredientService.ts";
import CollapseElement from "../CollapseElement.tsx";

interface BaseDropdownProps {
    handleReplaceBaseIngredient: (newBaseIngredient: Ingredient) => void; // Metodo per sostituire la base
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
    handleReplaceBaseIngredient,
}) => {
    const [bases, setBases] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [elementState, setElementState] = useState<boolean>(false);

    useEffect(() => {
        const fetchBases = async () => {
            try {
                const baseIngredients = await getBaseIngredients();
                setBases(baseIngredients);
            } catch (error) {
                console.error("Errore durante il caricamento delle basi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBases();
    }, []);

    return (
        <div>
            <button
                className="btn btn-warning dropdown-toggle"
                type="button"
                onClick={() => setElementState(!elementState)}
            >
                {loading ? "Caricamento..." : "Sostituisci Impasto"}
            </button>

            <CollapseElement open={elementState} className="bg-white">
                {bases.length > 0 ? (
                    bases.map((base) => (
                        <button
                            key={base.documentId}
                            className="dropdown-item"
                            onClick={() => handleReplaceBaseIngredient(base)}
                        >
                            {base.name} - {base.price.toFixed(2)}€
                        </button>
                    ))
                ) : (
                    !loading && (
                        <li className="dropdown-item text-muted">Nessuna base disponibile</li>
                    )
                )}
            </CollapseElement>

        </div>
    );
};

export default BaseDropdown;