import React from 'react';

import "./collapseElement.css";

interface PropType {
    open: boolean;              // Whether the element is open or closed
    children: React.ReactNode;  // Collapse element content
    className?: string;         // Optional CSS class for extra styling
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
                'collapse-el ' +
                (open ? "open " : "closed ") +
                (className ? className : "")
            }
        >
            {children}
        </div>
    );
}

export default CollapseElement;