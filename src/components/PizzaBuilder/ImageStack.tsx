import React, { useState } from "react";
import "../../bootstrap.css";
import { Ingredient, mozzarella, salsaDiPomodoro, sortIngredients } from "./IngredientComponent.tsx";

interface ImageStackProps {
    allIngredients: Ingredient[];
}

const ImageStack: React.FC<ImageStackProps> = ({ allIngredients }) => {
    // Determina l'ingrediente base
    const baseIngredient = allIngredients.find((ing) => ing.type === "pizza-base");
    // Combina gli ingredienti extra
    const extraIngredients = allIngredients.filter((ing) => ing.type === "extra");
    //console.log(allIngredients);
    //console.log(extraIngredients);
    const sortedIngredients = sortIngredients(extraIngredients, 'desc');

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">

            <div
                className="position-relative mt-5"
                style={{ width: "100%", height: "400px" }}
            >
                <img
                    key={baseIngredient.documentId}
                    src={baseIngredient.full_img_link}
                    alt={baseIngredient.name}
                    className="position-absolute top-50 start-50 translate-middle"
                    style={{ width: "70%", height: "70%", objectFit: "cover" }}
                />
                {sortedIngredients.map((ingredient) => (
                    <img
                        key={ingredient.documentId}
                        src={ingredient.full_img_link}
                        alt={ingredient.name}
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{ width: "60%", height: "60%", objectFit: "cover" }}
                    />
                ))}
            </div>

        </div>
    );
};

export default ImageStack;