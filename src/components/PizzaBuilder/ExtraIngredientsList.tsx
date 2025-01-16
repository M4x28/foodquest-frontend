import React from "react";
import { Ingredient, mozzarella, salsaDiPomodoro, sortIngredients } from "./IngredientComponent.tsx";
import { Button } from "../Button.tsx";

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
        <div style={{ maxHeight: "300px", overflowY: "auto" }} className="container mt-3 bg-white">
            {sortedIngredients.map((ingredient) => (
                <div className="row text-center py-2 border-bottom" key={ingredient.documentId}>
                    <div className="col-2">
                        <Button
                            variant="outline-danger"
                            size="sm"
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