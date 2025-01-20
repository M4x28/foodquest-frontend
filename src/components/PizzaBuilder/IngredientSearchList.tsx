import React, { useState, useEffect } from "react";
import { DetailIngredient } from "../../server/server.ts";
import { backendServer } from "../../App.tsx";

interface IngredientSearchListProps {
    handleAddIngredients: (newIngredients: DetailIngredient[]) => void;
    setPopupState: (state: boolean) => void; // Aggiunto setPopupState come prop
    popupState: boolean; // Aggiunto popupState come prop
    recommendedIngredients?: DetailIngredient[]; // Aggiunto per ordinare gli ingredienti
    allIngredients: DetailIngredient[]; // Aggiunto per escludere gli ingredienti già selezionati
}

const IngredientSearchList: React.FC<IngredientSearchListProps> = ({ handleAddIngredients, setPopupState, popupState, recommendedIngredients, allIngredients }) => {
    const [ingredients, setIngredients] = useState<DetailIngredient[]>([]);
    const [filteredIngredients, setFilteredIngredients] = useState<DetailIngredient[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const extraIngredients = await backendServer.ingredient.getExtraIngredients();
                let sortedIngredients = extraIngredients;

                // Escludi gli ingredienti già selezionati
                const selectedIds = new Set(allIngredients.map((ing) => ing.documentId));
                sortedIngredients = sortedIngredients.filter(
                    (ingredient) => !selectedIds.has(ingredient.documentId)
                );

                // Ordina gli ingredienti se ci sono raccomandazioni
                if (recommendedIngredients && recommendedIngredients.length > 0) {
                    const recommendedIds = new Set(recommendedIngredients.map((ingredient) => ingredient.documentId));

                    // Combina gli ingredienti raccomandati con gli extra non presenti tra i raccomandati
                    sortedIngredients = [
                        ...recommendedIngredients.filter(
                            (recIng) => !selectedIds.has(recIng.documentId)
                        ), // Aggiungi solo quelli raccomandati non già selezionati
                        ...sortedIngredients.filter(
                            (ingredient) => !recommendedIds.has(ingredient.documentId) // Escludi gli ingredienti già raccomandati
                        ),
                    ];
                }

                setIngredients(sortedIngredients);
                setFilteredIngredients(sortedIngredients);
            } catch (error) {
                console.error("Errore durante il caricamento degli ingredienti:", error);
            }
        };
        fetchIngredients();
    }, [recommendedIngredients, allIngredients]);

    useEffect(() => {
        const filtered = ingredients.filter((ingredient) =>
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIngredients(filtered);
    }, [searchTerm, ingredients]);

    return (
        <div className="container mt-4">
            <div className="mb-3 mt-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Cerca Ingrediente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div style={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}>
                {filteredIngredients.map((ingredient) => (
                    <div
                        key={ingredient.documentId}
                        className="row text-center align-items-center py-2"
                        onClick={() => {
                            handleAddIngredients([ingredient]);
                            setPopupState(!popupState);
                            setSearchTerm('');
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="col-3">
                            <img
                                src={require("../../assets".concat(ingredient.icon_img_link))}
                                alt={ingredient.name}
                                style={{ width: "160%", height: "160%" }}
                            />
                        </div>
                        <div className="col-9">
                            <h5 className="text-primary text-capitalize">
                                {ingredient.name} {ingredient.price.toFixed(2)}€
                            </h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IngredientSearchList;