import React from 'react';
import "./page.css";

// Importa l'icona di errore
import { ReactComponent as ErrorIcon } from "../assets/error.svg";

// Hook per la navigazione
import { useNavigate } from 'react-router-dom';

// Tipo per le proprietà del componente
interface PropType {
    errorTitle?: string, // Titolo del messaggio di errore (opzionale)
    errorMessage?: string, // Messaggio di errore (opzionale)
    retryBtn?: boolean, // Flag per mostrare il pulsante di riprova (opzionale)
}

// Valori predefiniti per il titolo e il messaggio di errore
const defaultTitle = ":-/ Qualcosa è andato storto";
const defaultMessage = "Si è verificato un errore. Per favore, riprova.";

/**
 * Componente per visualizzare una pagina di errore.
 * 
 * @param {string} [errorTitle] - Titolo del messaggio di errore (default: `defaultTitle`).
 * @param {string} [errorMessage] - Messaggio di errore (default: `defaultMessage`).
 * @param {boolean} [retryBtn] - Mostra il pulsante di riprova (default: true).
 */
function ErrorPage({ errorTitle = defaultTitle, errorMessage = defaultMessage, retryBtn = true }: PropType) {
    const navigate = useNavigate(); // Hook per la navigazione

    return (
        <div className='err-page'>
            {/* Intestazione della pagina di errore */}
            <header className='page-box-bg'>
                <ErrorIcon /> {/* Icona di errore */}
                <h1>{errorTitle}</h1> {/* Titolo dell'errore */}
            </header>

            {/* Messaggio di errore */}
            <p>{errorMessage}</p>

            {/* Pulsante di riprova, visibile solo se `retryBtn` è true */}
            {retryBtn &&
                <button className="light-btn retry-btn" onClick={() => navigate(-1)}> {/* Naviga indietro */}
                    Riprova
                </button>
            }
        </div>
    );
}

export default ErrorPage;