// Concetto di un wrapper per una pagina
import React from 'react';

// Importa il file di stile per la pagina
import "./page.css";

// Interfaccia per definire la struttura degli errori
export interface Error {
    error: boolean;              // Flag per indicare se c'è un errore
    errorTitle?: string;         // Titolo opzionale per l'errore
    errorMessage?: string;       // Messaggio opzionale per l'errore
}

// Interfaccia per le proprietà del componente `Page`
interface PropType {
    children?: React.ReactNode;  // Contenuto figlio della pagina
}

/**
 * Componente `Page`.
 * Questo componente serve come wrapper per avvolgere il contenuto di una pagina.
 * 
 * @param {React.ReactNode} children - Contenuto da renderizzare all'interno della pagina.
 * @returns {JSX.Element} Componente wrapper con lo stile della pagina.
 */
function Page({ children }: PropType) {
    return (
        <div className='page'> {/* Contenitore principale con la classe CSS `page` */}
            {children} {/* Renderizza i figli passati come contenuto */}
        </div>
    );
}

export default Page;