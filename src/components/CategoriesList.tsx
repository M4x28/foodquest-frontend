import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Componente per la navigazione tra le pagine
import { backendServer } from "../App.tsx"; // Backend server per effettuare chiamate API
import { Category } from "../server/server.ts"; // Tipo `Category` per tipizzare i dati
import './CategoryList.css'; // Importa il file CSS per lo stile del componente
import { Button } from "./input/Button.tsx"; // Importa il componente personalizzato `Button`

/**
 * Componente `CategoriesList`.
 * Visualizza un elenco di categorie come bottoni che, quando cliccati, reindirizzano alla lista di prodotti della categoria selezionata.
 */
const CategoriesList: React.FC = () => {
    // Stato per memorizzare le categorie recuperate dal server
    const [categories, setCategories] = useState<Category[]>([]);

    // Effetto per recuperare le categorie al montaggio del componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Effettua la chiamata al server per ottenere le categorie
                const data = await backendServer.categories.fetchCategoriesIdAndName();
                setCategories(data); // Salva le categorie nello stato
            } catch (error) {
                console.error("Errore nel recupero delle categorie:", error); // Gestione dell'errore
            }
        };

        fetchCategories(); // Richiama la funzione per ottenere le categorie
    }, []); // L'effetto viene eseguito solo al primo montaggio

    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center px-3"
            style={{
                maxWidth: "400px", // Larghezza massima del contenitore
                width: "80%", // Larghezza dinamica per dispositivi più piccoli
            }}
        >
            {/* Mappa le categorie recuperate in bottoni con link */}
            {categories.map((category) => (
                <Link
                    to={`/products/${category.documentId}`} // Link alla pagina dei prodotti della categoria
                    key={category.documentId} // Chiave univoca per React
                    className="text-decoration-none w-100" // Rimuove decorazioni e utilizza tutta la larghezza
                >
                    <Button
                        variant="light text-dark fw-bold text-LG button-list" // Stile del bottone
                        size="lg" // Dimensione grande del bottone
                    >
                        {category.name} {/* Nome della categoria */}
                    </Button>
                </Link>
            ))}
        </div>
    );
};

export default CategoriesList;