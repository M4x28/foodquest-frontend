import React from "react";

import { DetailIngredient } from "../../server/server.ts";
import { Button } from "../input/Button.tsx";

type RecommendedIngredientProps = {
    ingredientWithRecommendation: DetailIngredient | null;
    recommendedIngredients: DetailIngredient[] | undefined;
    handleAddIngredients: (newIngredients: DetailIngredient[]) => void;
    handleAddRecommendedIngredients: () => void;
};

const RecommendedIngredient: React.FC<RecommendedIngredientProps> = ({
    ingredientWithRecommendation,
    recommendedIngredients,
    handleAddIngredients,
    handleAddRecommendedIngredients,
}) => {
    if (!recommendedIngredients || !ingredientWithRecommendation) {
        return null;
    }

    const lastRecommendedIngredient = recommendedIngredients.slice(-1)[0];

    if (!lastRecommendedIngredient) {
        return null;
    }

    return (
        <div className="px-3 py-1">
            <div className="d-flex justify-content-between align-items-center">
                <h5>
                    Abbina {ingredientWithRecommendation.name} con un tocco speciale di
                    <span
                        key={lastRecommendedIngredient.documentId}
                        className="text-LG text-info mx-1"
                        onClick={() => handleAddIngredients([lastRecommendedIngredient])}
                    >
                        {lastRecommendedIngredient.name}
                    </span>
                    <Button
                        variant="info"
                        className="rounded-3"
                        size="sm"
                        onClick={handleAddRecommendedIngredients}
                        style={{ marginLeft: '10px' }}
                    >
                        +
                    </Button>
                </h5>
            </div>
        </div>
    );
};

export default RecommendedIngredient