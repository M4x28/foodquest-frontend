import React, { useEffect, useState } from "react";
import CollapseElement from "../utility/CollapseElement.tsx"; // Importa il componente per gestire l'elemento a scomparsa
import { DetailIngredient } from "../../server/server.ts"; // Importa il tipo `DetailIngredient`
import { backendServer } from "../../App.tsx"; // Importa il connettore del backend

// Interfaccia per le proprietà accettate dal componente `BaseDropdown`
interface BaseDropdownProps {
    handleReplaceBaseIngredient: (newBaseIngredient: DetailIngredient) => void; // Funzione per sostituire la base
}

/**
 * Componente `BaseDropdown`.
 * Consente all'utente di selezionare e sostituire la base di un prodotto tramite un menu a tendina.
 * 
 * @param {Function} handleReplaceBaseIngredient - Metodo per sostituire la base selezionata.
 */
const BaseDropdown: React.FC<BaseDropdownProps> = ({
    handleReplaceBaseIngredient,
}) => {
    // Stato per gestire le basi disponibili
    const [bases, setBases] = useState<DetailIngredient[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Stato per indicare il caricamento
    const [elementState, setElementState] = useState<boolean>(false); // Stato per gestire l'apertura del menu a tendina

    // Effetto per caricare le basi all'avvio del componente
    useEffect(() => {
        const fetchBases = async () => {
            try {
                // Recupera gli ingredienti base dal backend
                const baseIngredients = await backendServer.ingredient.getBaseIngredients();
                setBases(baseIngredients); // Aggiorna lo stato con le basi caricate
            } catch (error) {
                console.error("Errore durante il caricamento delle basi:", error); // Log degli errori
            } finally {
                setLoading(false); // Imposta lo stato di caricamento su `false`
            }
        };
        fetchBases(); // Esegue la funzione per recuperare le basi
    }, []); // Dipendenze vuote: viene eseguito solo al montaggio del componente

    return (
        <div
            className="mb-5"
            style={{
                position: "relative", // Posizionamento relativo per gestire gli elementi assoluti interni
                display: "flex", // Disposizione flessibile
                justifyContent: "center", // Centra gli elementi orizzontalmente
                alignItems: "center", // Centra gli elementi verticalmente
                flexDirection: "column", // Disposizione verticale degli elementi
            }}
        >
            {/* Bottone per aprire o chiudere il menu a tendina */}
            <div className="position-absolute">
                <button
                    className="btn btn-warning dropdown-toggle" // Stile del bottone
                    type="button"
                    onClick={() => setElementState(!elementState)} // Cambia lo stato di visibilità del menu
                >
                    {loading ? "Caricamento..." : "Sostituisci Impasto"} {/* Testo dinamico */}
                </button>
            </div>

            {/* Menu a tendina per selezionare una base */}
            <div className="position-fixed" style={{ top: "468px" }}>
                <CollapseElement
                    open={elementState} // Controlla la visibilità del menu
                    className="bg-white border border-warning border-3 rounded-4 pt-2" // Stile del menu
                >
                    {bases.length > 0 ? (
                        // Mostra le basi disponibili
                        bases.map((base) => (
                            <button
                                key={base.documentId} // Chiave unica per ogni base
                                className="dropdown-item px-4 py-2" // Stile del bottone della base
                                onClick={() => {
                                    handleReplaceBaseIngredient(base); // Chiama la funzione per sostituire la base
                                    setElementState(!elementState); // Chiude il menu
                                }}
                            >
                                <h5>
                                    <b>
                                        {base.name} {base.price.toFixed(2)}€ {/* Nome e prezzo della base */}
                                    </b>
                                </h5>
                            </button>
                        ))
                    ) : (
                        // Messaggio di fallback se non ci sono basi disponibili
                        !loading && (
                            <li className="dropdown-item">Nessuna base disponibile</li>
                        )
                    )}
                </CollapseElement>
            </div>
        </div>
    );
};

export default BaseDropdown;