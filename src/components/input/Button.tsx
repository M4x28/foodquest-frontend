import React from 'react'; // Importa la libreria React per creare componenti.
import '../../bootstrap.css'; // Importa il file CSS di Bootstrap per utilizzare le classi predefinite.

interface ButtonProps { // Definisce l'interfaccia delle proprietà accettate dal componente Button.
    variant?: string; // Tipo di variante del bottone (es. success, danger).
    size?: string; // Dimensione del bottone (es. sm, lg).
    onClick?: () => void; // Funzione callback per l'evento click del bottone.
    className?: string; // Classe aggiuntiva per personalizzazioni.
    children?: React.ReactNode; // Contenuto da mostrare all'interno del bottone.
    [key: string]: any; // Permette proprietà aggiuntive dinamiche (es. data-* o aria-*).
}

export const Button: React.FC<ButtonProps> = ({ // Definizione del componente funzionale Button.
    variant = 'success', // Imposta 'success' come valore predefinito per la variante.
    size, // Opzionale: dimensione del bottone.
    onClick, // Opzionale: funzione da chiamare al click del bottone.
    className = '', // Imposta una stringa vuota come valore predefinito per la classe aggiuntiva.
    children, // Contenuto del bottone (es. testo o altri elementi React).
    ...props // Raccoglie tutte le altre proprietà passate al componente.
}) => {
    const sizeClass = size ? `btn-${size}` : ''; // Calcola la classe Bootstrap per la dimensione, se specificata.
    const variantClass = variant ? `btn-${variant}` : 'btn-success'; // Calcola la classe Bootstrap per la variante, con valore predefinito 'btn-success'.
    return (
        <button
            className={`btn ${variantClass} ${sizeClass} ${className}`} // Applica le classi CSS dinamiche di Bootstrap e personalizzate.
            type="button" // Specifica che il bottone è di tipo "button" (non invia un modulo).
            onClick={onClick} // Associa la funzione callback all'evento click, se fornita.
            style={{
                fontFamily: "Luckiest Guy, cursive", // Imposta il font per il testo del bottone.
                letterSpacing: "0.1rem", // Aggiunge uno spazio tra le lettere.
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Aggiunge un'ombra al bottone.
            }}
            {...props} // Passa tutte le proprietà aggiuntive al bottone (es. data-* o aria-*).
        >
            {children} {/* Mostra il contenuto fornito come children nel bottone. */}
        </button>
    );
};
