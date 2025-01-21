import React from "react";
import { stopPropagation } from "../../utility/generic.ts";

import { ReactComponent as CloseIcon } from "../../assets/close.svg";

import "./Popup.css";

interface PropType {
    children: React.ReactNode;       // Popup content
    isOpen: boolean;                 // Show the popup
    close: () => void;               // Function to close popup, to be effective must change isOpen value in some way

    closeBtn?: boolean;              // Show close button ( x on top of the component)
    containerClass?: string;         // Optional override CSS class for popup contaier and bg
    popupClass?: string;             // Optional override CSS class for popup item
    blurPage?: boolean;              // Whether or not apply blur effect on the page when popup is open
}

/**
 * Componente `Popup`.
 * Visualizza un popup con opzioni per la chiusura e personalizzazioni di stile.
 * 
 * @param {boolean} isOpen - Determina se il popup è visibile.
 * @param {Function} close - Funzione per chiudere il popup. Per essere efficace de cambiare in qualche modo is open
 * @param {React.ReactNode} children - Contenuto visualizzato all'interno del popup.
 * @param {boolean} [blurPage=true] - Applica o meno un effetto blur alla pagina.
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
    
    //Add hidden class if popup is hidden
    if (!isOpen) {
        containerClass = "solid-snake";
    }

    //Add blur bg class if enabled
    if (blurPage) {
        containerClass += " glass";
    }

    return(
        <div className={containerClass} onClick={close} >
            <div className={popupClass} onClick = {stopPropagation}>
                {closeBtn && 
                    <button className = "close-btn" onClick={close} title="close">
                        <CloseIcon/>
                    </button>
                }
                {children}
            </div>
        </div>
    );
}

export default Popup;