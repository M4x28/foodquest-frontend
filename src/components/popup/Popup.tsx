import React from "react";

// Importa l'icona di chiusura per il popup
import { ReactComponent as CloseIcon } from "../../assets/close.svg";

// Importa la funzione utility per fermare la propagazione dell'evento di click
import { stopPropagation } from "../../utility/generic.ts";

// Importa lo stile CSS per il popup
import "./Popup.css";

// Interfaccia per le proprietà accettate dal componente `Popup`
interface PropType {
    children: React.ReactNode;        // Contenuto da visualizzare all'interno del popup
    isOpen: boolean;                 // Indica se il popup è aperto o chiuso
    close: () => void;               // Funzione per chiudere il popup

    closeBtn?: boolean;              // Opzionale: Mostra il pulsante di chiusura (default: true)
    containerClass?: string;         // Opzionale: Classe CSS per il contenitore del popup (default: "popup-overlay")
    popupClass?: string;             // Opzionale: Classe CSS per il contenuto del popup (default: "popup-content")
    blurPage?: boolean;              // Opzionale: Aggiunge un effetto blur allo sfondo (default: true)
}

/**
 * Componente `Popup`.
 * Visualizza un popup con opzioni per la chiusura e personalizzazioni di stile.
 * 
 * @param {boolean} isOpen - Determina se il popup è visibile.
 * @param {Function} close - Funzione per chiudere il popup.
 * @param {React.ReactNode} children - Contenuto visualizzato all'interno del popup.
 * @param {boolean} [blurPage=true] - Applica un effetto blur alla pagina.
 * @param {boolean} [closeBtn=true] - Mostra il pulsante di chiusura.
 * @param {string} [containerClass="popup-overlay"] - Classe CSS per il contenitore.
 * @param {string} [popupClass="popup-content"] - Classe CSS per il contenuto.
 */
function Popup({
    isOpen,
    close,
    children,
    blurPage = true,
    closeBtn = true,
    containerClass = "popup-overlay",
    popupClass = "popup-content",
}: PropType) {
    // Se il popup non è aperto, assegna una classe specifica per nascondere il contenitore
    if (!isOpen) {
        containerClass = "solid-snake"; // Classe CSS che probabilmente nasconde il popup
    }

    // Se è abilitato l'effetto blur, aggiunge una classe per gestirlo
    if (blurPage) {
        containerClass += " glass"; // Classe CSS per applicare l'effetto blur
    }

    return (
        // Contenitore del popup: chiude il popup quando si clicca fuori dal contenuto
        <div className={containerClass} onClick={close}>
            {/* Contenitore del contenuto del popup */}
            <div className={popupClass} onClick={stopPropagation}>
                {/* Pulsante di chiusura, visibile solo se `closeBtn` è true */}
                {closeBtn && (
                    <button className="close-btn" onClick={close} title="close">
                        <CloseIcon /> {/* Icona di chiusura */}
                    </button>
                )}
                {/* Contenuto dinamico del popup */}
                {children}
            </div>
        </div>
    );
}

export default Popup;