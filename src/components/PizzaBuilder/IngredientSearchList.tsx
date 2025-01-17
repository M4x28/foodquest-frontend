import React, { useState, useEffect } from "react";
import { Ingredient } from "./IngredientComponent.tsx";
import { getExtraIngredients } from "../../services/ingredientService.ts";

interface IngredientSearchListProps {
    handleAddIngredients: (newIngredients: Ingredient[]) => void;
}

interface IngredientSearchListProps {
    handleAddIngredients: (newIngredients: Ingredient[]) => void;
    setPopupState: (state: boolean) => void; // Aggiunto setPopupState come prop
    popupState: boolean; // Aggiunto popupState come prop
    recommendedIngredient?: Ingredient; // Aggiunto per ordinare gli ingredienti
}

const IngredientSearchList: React.FC<IngredientSearchListProps> = ({ handleAddIngredients, setPopupState, popupState, recommendedIngredient, }) => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const extraIngredients = await getExtraIngredients();
                let sortedIngredients = extraIngredients;

                // Ordina gli ingredienti se c'è un ingrediente raccomandato
                if (recommendedIngredient) {
                    sortedIngredients = [
                        recommendedIngredient,
                        ...extraIngredients.filter(
                            (ingredient) => ingredient.documentId !== recommendedIngredient.documentId
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
    }, [recommendedIngredient]);

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
                                src={ingredient.icon_img_link}
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