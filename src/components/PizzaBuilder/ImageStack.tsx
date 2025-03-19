import React from "react";
import "../../App.css";
import "../../bootstrap.css";
import { DetailIngredient } from "../../server/server.ts";
import { sortIngredients } from "../../utility/ingredientSorter.ts";

interface ImageStackProps {
    allIngredients: DetailIngredient[];
    baseSize?: string; // default: "min(500px, 70vw)"
    extraSize?: string; // default: "min(500px, 60vw)"
    height?: string;
}

const ImageStack: React.FC<ImageStackProps> = ({
    allIngredients,
    baseSize = "min(400px, 70vw)",
    extraSize = "min(400px, 60vw)",
    height = "400px",
}) => {
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Se la finestra è più larga di 500px, imposta dimensioni fisse a 500px.
    const effectiveBaseSize = windowWidth > 480 ? "320px" : baseSize;
    const effectiveExtraSize = windowWidth > 480 ? "280px" : extraSize;

    const baseIngredient = allIngredients.find((ing) => ing.type === "pizza-base");
    const extraIngredients = allIngredients.filter((ing) => ing.type === "extra");
    const sortedIngredients = sortIngredients(extraIngredients, "desc");

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div
                className="position-relative mt-5 image-stack-container"
                style={{ height }} // Applica l'altezza passata come prop
            >
                {baseIngredient && (
                    <img
                        key={baseIngredient.documentId}
                        src={require("../../assets".concat(baseIngredient.full_img_link))}
                        alt={baseIngredient.name}
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{
                            width: effectiveBaseSize,
                            height: effectiveBaseSize,
                            objectFit: "cover",
                        }}
                    />
                )}

                {sortedIngredients.map((ingredient) => (
                    <img
                        key={ingredient.documentId}
                        src={require("../../assets".concat(ingredient.full_img_link))}
                        alt={ingredient.name}
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{
                            width: effectiveExtraSize,
                            height: effectiveExtraSize,
                            objectFit: "cover",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageStack;
