import React from 'react';
import '../bootstrap.css'; // Importa il file CSS di Bootstrap per lo stile del dropdown
import { Button } from './Button.tsx'; // Importa il componente personalizzato `Button`

/**
 * Componente `DropdownButton`.
 * Rappresenta un bottone che, quando cliccato, apre un menu a tendina.
 * 
 * @param {string} id - ID univoco per il bottone e l'elemento associato.
 * @param {string} title - Testo o contenuto visualizzato nel bottone.
 * @param {React.ReactNode} children - Contenuto del menu a tendina.
 */
export const DropdownButton = ({ id, title, children }) => {
    return (
        <div className="dropdown">
            {/* Bottone per aprire il menu a tendina */}
            <Button
                variant="secondary"            // Variante di stile per il bottone
                size=""                         // Dimensione (lasciata vuota per il valore predefinito)
                onClick={() => { }}             // Funzione di clic (attualmente vuota)
                id={id}                         // ID univoco per collegare il bottone al menu
                data-bs-toggle="dropdown"       // Attributo richiesto da Bootstrap per attivare il dropdown
                aria-expanded="false"           // Stato di espansione (gestito da Bootstrap)
            >
                {title} {/* Testo o contenuto del bottone */}
            </Button>
            {/* Menu a tendina associato */}
            <ul className="dropdown-menu" aria-labelledby={id}>
                {children} {/* Elementi del menu */}
            </ul>
        </div>
    );
};

/**
 * Componente `Dropdown`.
 * Rappresenta un contenitore per un menu a tendina che può essere utilizzato separatamente.
 * 
 * @param {React.ReactNode} children - Contenuto del menu a tendina.
 */
export const Dropdown = ({ children }) => {
    return (
        <ul className="dropdown-menu">
            {children} {/* Elementi del menu */}
        </ul>
    );
};

/**
 * Componente `DropdownItem`.
 * Rappresenta un singolo elemento cliccabile all'interno del menu a tendina.
 * 
 * @param {Function} onClick - Funzione eseguita quando l'elemento viene cliccato.
 * @param {React.ReactNode} children - Contenuto visualizzato nell'elemento.
 */
export const DropdownItem = ({ onClick, children }) => {
    return (
        <li>
            {/* Bottone che rappresenta un elemento del menu */}
            <button
                className="dropdown-item" // Classe di Bootstrap per lo stile degli elementi del menu
                type="button"             // Specifica che è un bottone
                onClick={onClick}         // Funzione eseguita al clic
            >
                {children} {/* Contenuto dell'elemento */}
            </button>
        </li>
    );
};