import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ErrorIcon } from "../assets/error.svg";

import "./page.css";

interface PropType {
    errorTitle?: string,    // Error Page Title
    errorMessage?: string,  // Error message
    retryBtn?: boolean,     // Show the retry btn
}

// Default values for title and message
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
    
    const navigate = useNavigate();

    return (
        <div className='err-page'>
            <header className='page-box-bg'>
                <ErrorIcon />
                <h1>{errorTitle}</h1>
            </header>

            <p>{errorMessage}</p>

            {retryBtn &&
                <button className="light-btn retry-btn" onClick={() => navigate(-1)}> {/* Naviga indietro */}
                    Riprova
                </button>
            }
        </div>
    );
}

export default ErrorPage;