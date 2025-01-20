import React from 'react';

import "./collapseElement.css"; // Importa gli stili specifici per l'elemento a scomparsa

// Definizione delle proprietà accettate dal componente
interface PropType {
    open: boolean; // Indica se l'elemento è aperto (true) o chiuso (false)
    children: React.ReactNode; // Contenuto da visualizzare all'interno dell'elemento
    className?: string; // Classe CSS aggiuntiva opzionale per personalizzare lo stile
}

/**
 * Componente `CollapseElement`.
 * Gestisce un elemento a scomparsa che può essere aperto o chiuso dinamicamente.
 * 
 * @param {boolean} open - Stato del componente: aperto (true) o chiuso (false).
 * @param {React.ReactNode} children - Contenuto visualizzato all'interno dell'elemento.
 * @param {string} [className] - Classe CSS opzionale per personalizzare lo stile.
 * @returns Un elemento a scomparsa con il contenuto fornito.
 */
function CollapseElement({ open, children, className }: PropType) {
    return (
        <div
            className={
                'collapse-el ' + // Classe base per lo stile del componente
                (open ? "open " : "closed ") + // Aggiunge la classe `open` o `closed` in base allo stato
                (className ? className : "") // Aggiunge eventuali classi personalizzate
            }
        >
            {children} {/* Contenuto dell'elemento */}
        </div>
    );
}

export default CollapseElement; // Esporta il componente per l'uso in altri file