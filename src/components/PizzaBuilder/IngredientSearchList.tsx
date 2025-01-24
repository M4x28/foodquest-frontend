import React, { useEffect, useState } from "react";
import { backendServer } from "../../App.tsx"; // Importa il connettore del backend
import { DetailIngredient } from "../../server/server.ts"; // Importa il tipo `DetailIngredient`

// Proprietà accettate dal componente `IngredientSearchList`
interface IngredientSearchListProps {
    handleAddIngredients: (newIngredients: DetailIngredient[]) => void; // Funzione per aggiungere nuovi ingredienti
    setPopupState: (state: boolean) => void; // Funzione per aggiornare lo stato del popup
    popupState: boolean; // Stato attuale del popup
    recommendedIngredients?: DetailIngredient[]; // Lista opzionale di ingredienti raccomandati
    allIngredients: DetailIngredient[]; // Lista di tutti gli ingredienti già selezionati
}

/**
 * Componente `IngredientSearchList`.
 * Visualizza una lista di ingredienti cercabili e selezionabili.
 * 
 * @param {Function} handleAddIngredients - Funzione per gestire l'aggiunta di nuovi ingredienti.
 * @param {Function} setPopupState - Funzione per aggiornare lo stato del popup.
 * @param {boolean} popupState - Stato attuale del popup.
 * @param {DetailIngredient[]} [recommendedIngredients] - Lista opzionale di ingredienti raccomandati.
 * @param {DetailIngredient[]} allIngredients - Lista di tutti gli ingredienti già selezionati.
 */
const IngredientSearchList: React.FC<IngredientSearchListProps> = ({
    handleAddIngredients,
    setPopupState,
    popupState,
    recommendedIngredients,
    allIngredients
}) => {
    // Stato per gestire gli ingredienti caricati e filtrati
    const [ingredients, setIngredients] = useState<DetailIngredient[]>([]);
    const [filteredIngredients, setFilteredIngredients] = useState<DetailIngredient[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // Stato per il termine di ricerca

    // Effettua il caricamento degli ingredienti al montaggio del componente o al cambio delle dipendenze
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const extraIngredients = await backendServer.ingredient.getExtraIngredients(); // Carica gli ingredienti extra
                let sortedIngredients = extraIngredients;

                // Escludi gli ingredienti già selezionati
                const selectedIds = new Set(allIngredients.map((ing) => ing.documentId));
                sortedIngredients = sortedIngredients.filter(
                    (ingredient) => !selectedIds.has(ingredient.documentId)
                );

                // Ordina gli ingredienti se sono presenti raccomandazioni
                if (recommendedIngredients && recommendedIngredients.length > 0) {
                    const recommendedIds = new Set(recommendedIngredients.map((ingredient) => ingredient.documentId));

                    // Combina gli ingredienti raccomandati con quelli extra non raccomandati
                    sortedIngredients = [
                        ...recommendedIngredients.filter(
                            (recIng) => !selectedIds.has(recIng.documentId) // Aggiungi solo raccomandati non selezionati
                        ),
                        ...sortedIngredients.filter(
                            (ingredient) => !recommendedIds.has(ingredient.documentId) // Escludi quelli già raccomandati
                        ),
                    ];
                }

                setIngredients(sortedIngredients); // Aggiorna lo stato degli ingredienti
                setFilteredIngredients(sortedIngredients); // Aggiorna lo stato degli ingredienti filtrati
            } catch (error) {
                console.error("Errore durante il caricamento degli ingredienti:", error); // Log dell'errore
            }
        };

        fetchIngredients(); // Chiamata alla funzione per caricare gli ingredienti
    }, [recommendedIngredients, allIngredients]); // Dipendenze: ingredienti raccomandati e tutti gli ingredienti

    // Filtra gli ingredienti in base al termine di ricerca
    useEffect(() => {
        const filtered = ingredients.filter((ingredient) =>
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) // Confronta il termine di ricerca
        );
        setFilteredIngredients(filtered); // Aggiorna lo stato degli ingredienti filtrati
    }, [searchTerm, ingredients]); // Dipendenze: termine di ricerca e lista degli ingredienti

    return (
        <div className="container mt-4">
            {/* Input per cercare gli ingredienti */}
            <div className="mb-3 mt-5 pt-3">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Cerca Ingrediente" // Placeholder per l'input
                    value={searchTerm} // Stato del termine di ricerca
                    onChange={(e) => setSearchTerm(e.target.value)} // Aggiorna il termine di ricerca
                />
            </div>

            {/* Lista di ingredienti filtrati */}
            <div style={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}>
                {filteredIngredients.map((ingredient) => (
                    <div
                        key={ingredient.documentId} // Chiave unica per ogni ingrediente
                        className="row text-center align-items-center py-2"
                        onClick={() => {
                            handleAddIngredients([ingredient]); // Aggiungi l'ingrediente selezionato
                            setPopupState(!popupState); // Chiudi il popup
                            setSearchTerm(''); // Resetta il termine di ricerca
                        }}
                        style={{ cursor: "pointer" }} // Cambia il cursore per indicare che è cliccabile
                    >
                        {/* Colonna per l'immagine dell'ingrediente */}
                        <div className="col-3">
                            <img
                                src={require("../../assets".concat(ingredient.icon_img_link))} // Percorso immagine
                                alt={ingredient.name} // Testo alternativo
                                style={{ width: "160%", height: "160%" }} // Stile dell'immagine
                            />
                        </div>

                        {/* Colonna per il nome e il prezzo dell'ingrediente */}
                        <div className="col-9">
                            <h5 className="text-primary text-capitalize">
                                {ingredient.name} {ingredient.price.toFixed(2)}€ {/* Prezzo formattato */}
                            </h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IngredientSearchList;