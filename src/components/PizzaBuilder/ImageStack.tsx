import React from "react";
import "../../bootstrap.css"; // Importa il file CSS di Bootstrap per il layout
import { DetailIngredient } from "../../server/server.ts"; // Importa il tipo `DetailIngredient`
import { sortIngredients } from "../../utility/ingredientSorter.ts"; // Importa la funzione per ordinare gli ingredienti

// Interfaccia per le proprietà accettate dal componente `ImageStack`
interface ImageStackProps {
    allIngredients: DetailIngredient[]; // Lista di tutti gli ingredienti
    baseSize?: string;                  // Dimensione degli ingredienti base (opzionale, default: "70%")
    extraSize?: string;                 // Dimensione degli ingredienti extra (opzionale, default: "60%")
    height: string;                     // Altezza dello stack delle immagini
}

/**
 * Componente `ImageStack`.
 * Visualizza uno stack di immagini che rappresentano gli ingredienti di una pizza.
 * 
 * @param {DetailIngredient[]} allIngredients - Lista di tutti gli ingredienti.
 * @param {string} [baseSize="70%"] - Dimensione degli ingredienti base (default: 70%).
 * @param {string} [extraSize="60%"] - Dimensione degli ingredienti extra (default: 60%).
 * @param {string} height - Altezza del contenitore dello stack.
 */
const ImageStack: React.FC<ImageStackProps> = ({
    allIngredients,
    baseSize = "70%",
    extraSize = "60%",
    height = "400px",
}) => {
    // Determina l'ingrediente base (di tipo "pizza-base")
    const baseIngredient = allIngredients.find((ing) => ing.type === "pizza-base");

    // Filtra gli ingredienti extra (di tipo "extra")
    const extraIngredients = allIngredients.filter((ing) => ing.type === "extra");

    // Ordina gli ingredienti extra usando la funzione `sortIngredients`
    const sortedIngredients = sortIngredients(extraIngredients, "desc");

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            {/* Contenitore principale per lo stack delle immagini */}
            <div
                className="position-relative mt-5"
                style={{ width: "100%", height }} // Altezza e larghezza impostate dinamicamente
            >
                {/* Mostra l'ingrediente base se presente */}
                {baseIngredient && (
                    <img
                        key={baseIngredient.documentId} // Chiave unica per React
                        src={require("../../assets".concat(baseIngredient.full_img_link))} // Percorso dell'immagine
                        alt={baseIngredient.name} // Testo alternativo
                        className="position-absolute top-50 start-50 translate-middle" // Posizionamento assoluto al centro
                        style={{
                            width: baseSize, // Dimensione dinamica
                            height: baseSize,
                            objectFit: "cover", // Adatta l'immagine senza distorsioni
                        }}
                    />
                )}

                {/* Mostra tutti gli ingredienti extra ordinati */}
                {sortedIngredients.map((ingredient) => (
                    <img
                        key={ingredient.documentId} // Chiave unica per React
                        src={require("../../assets".concat(ingredient.full_img_link))} // Percorso dell'immagine
                        alt={ingredient.name} // Testo alternativo
                        className="position-absolute top-50 start-50 translate-middle" // Posizionamento assoluto al centro
                        style={{
                            width: extraSize, // Dimensione dinamica
                            height: extraSize,
                            objectFit: "cover", // Adatta l'immagine senza distorsioni
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageStack;