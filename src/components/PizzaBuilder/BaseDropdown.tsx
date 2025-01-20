import React, { useEffect, useState } from "react";
import CollapseElement from "../utility/CollapseElement.tsx";
import { DetailIngredient } from "../../server/server.ts";
import { backendServer } from "../../App.tsx";

interface BaseDropdownProps {
    handleReplaceBaseIngredient: (newBaseIngredient: DetailIngredient) => void; // Metodo per sostituire la base
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
    handleReplaceBaseIngredient,
}) => {
    const [bases, setBases] = useState<DetailIngredient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [elementState, setElementState] = useState<boolean>(false);

    useEffect(() => {
        const fetchBases = async () => {
            try {
                const baseIngredients = await backendServer.ingredient.getBaseIngredients();
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
        <div className="mb-5" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div className="position-absolute">
                <button
                    className="btn btn-warning dropdown-toggle"
                    type="button"
                    onClick={() => setElementState(!elementState)}
                >
                    {loading ? "Caricamento..." : "Sostituisci Impasto"}
                </button>
            </div>

            <div className="position-fixed" style={{ top: '468px' }}>
                <CollapseElement
                    open={elementState}
                    className="bg-white border border-warning border-3 rounded-4 pt-2"
                >
                    {bases.length > 0 ? (
                        bases.map((base) => (
                            <button
                                key={base.documentId}
                                className="dropdown-item px-4 py-2"
                                onClick={() => {
                                    handleReplaceBaseIngredient(base);
                                    setElementState(!elementState);
                                }}
                            >
                                <h5><b>{base.name} {base.price.toFixed(2)}€</b></h5>
                            </button>
                        ))
                    ) : (
                        !loading && (
                            <li className="dropdown-item">Nessuna base disponibile</li>
                        )
                    )}
                </CollapseElement>
            </div>
        </div>
    );
};

export default BaseDropdown;