import React from "react";
import { Ingredient, sortIngredients } from "./IngredientComponent.tsx";
import { Button } from "../input/Button.tsx";

interface ExtraIngredientsListProps {
    extraIngredients: Ingredient[];
    handleRemoveIngredient: (ingredientId: string) => void;
}

const ExtraIngredientsList: React.FC<ExtraIngredientsListProps> = ({
    extraIngredients,
    handleRemoveIngredient,
}) => {
    const sortedIngredients = sortIngredients(extraIngredients, 'asc');

    return (
        <div style={{ maxHeight: "150px", overflowY: "auto" }} className="container mt-3 pt-2">
            {sortedIngredients.map((ingredient) => (
                <div className="row text-center py-2 px-3" key={ingredient.documentId}>
                    <div className="col-2">
                        <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => handleRemoveIngredient(ingredient.documentId)}
                        >
                            -
                        </Button>
                    </div>
                    <div className="col-8 d-flex align-items-center justify-content-center">
                        <h5 className="text-LG">{ingredient.name}</h5>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-center">
                        <h5 className="text-LG">{ingredient.price.toFixed(2)}</h5>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExtraIngredientsList;