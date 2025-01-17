import React from "react";
import "../../bootstrap.css";
import { Ingredient, sortIngredients } from "./IngredientComponent.tsx";

interface ImageStackProps {
    allIngredients: Ingredient[];
    baseSize?: string; // Dimensione base degli ingredienti di base
    extraSize?: string; // Dimensione base degli ingredienti extra
    height?: string; // Altezza dello stack
}

const ImageStack: React.FC<ImageStackProps> = ({
    allIngredients,
    baseSize = "70%",
    extraSize = "60%",
    height = "400px",
}) => {
    // Determina l'ingrediente base
    const baseIngredient = allIngredients.find((ing) => ing.type === "pizza-base");

    // Combina gli ingredienti extra
    const extraIngredients = allIngredients.filter((ing) => ing.type === "extra");

    // Ordina gli ingredienti extra
    const sortedIngredients = sortIngredients(extraIngredients, "desc");

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div
                className="position-relative mt-5"
                style={{ width: "100%", height }}
            >
                {baseIngredient && (
                    <img
                        key={baseIngredient.documentId}
                        src={baseIngredient.full_img_link}
                        alt={baseIngredient.name}
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{ width: baseSize, height: baseSize, objectFit: "cover" }}
                    />
                )}

                {sortedIngredients.map((ingredient) => (
                    <img
                        key={ingredient.documentId}
                        src={ingredient.full_img_link}
                        alt={ingredient.name}
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{ width: extraSize, height: extraSize, objectFit: "cover" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageStack;