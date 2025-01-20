import React, { useState } from 'react';
import { Button } from '../input/Button.tsx';
import Popup from './Popup.tsx';
import "./ConfirmPrompt.css";

// Definizione delle proprietà accettate dal componente `ButtonWithPrompt`
interface PropType {
    children: React.ReactNode;        // Contenuto del bottone principale
    onClick: () => void;              // Funzione da eseguire quando si conferma l'azione
    className?: string;               // Classe CSS per il bottone principale
    variant?: string;                 // Variante di stile del bottone principale
    size?: string;                    // Dimensione del bottone principale
    popupClass?: string;              // Classe CSS personalizzata per il popup
    confirmClass?: string;            // Classe CSS per il bottone di conferma nel popup
    popupTitle?: string;              // Titolo visualizzato nel popup
    popupText?: string;               // Testo esplicativo visualizzato nel popup
    confirmText?: string;             // Testo del bottone di conferma
    confirmSvg?: React.ReactElement;  // Icona SVG opzionale per il bottone di conferma
    confirmVariant?: string;          // Variante di stile del bottone di conferma
}

/**
 * Componente `ButtonWithPrompt`.
 * Combina un bottone principale con un prompt di conferma visualizzato in un popup.
 * 
 * @param {Function} onClick - Funzione eseguita quando l'utente conferma l'azione.
 * @param {React.ReactNode} children - Contenuto del bottone principale (es. testo o icona).
 * @param {string} [className] - Classe CSS personalizzata per il bottone principale.
 * @param {string} [variant] - Variante di stile per il bottone principale.
 * @param {string} [size] - Dimensione del bottone principale.
 * @param {string} [popupClass] - Classe CSS personalizzata per il popup.
 * @param {string} [confirmClass="dark-btn confirm-btn"] - Classe CSS per il bottone di conferma.
 * @param {string} [popupTitle="Sei sicuro?"] - Titolo del popup.
 * @param {string} [popupText="Questa azione non può essere annullata"] - Testo esplicativo nel popup.
 * @param {string} [confirmText="CONFERMA"] - Testo del bottone di conferma.
 * @param {React.ReactElement} [confirmSvg] - Icona SVG opzionale per il bottone di conferma.
 * @param {string} [confirmVariant] - Variante di stile per il bottone di conferma.
 */
function ButtonWithPrompt({
    children,
    onClick,
    className,
    variant,
    size,
    popupClass,
    confirmClass = "dark-btn confirm-btn", // Classe CSS predefinita per il bottone di conferma
    popupTitle = "Sei sicuro?",            // Titolo predefinito del popup
    popupText = "Questa azione non può essere annullata", // Testo predefinito del popup
    confirmText = "CONFERMA",              // Testo predefinito del bottone di conferma
    confirmVariant,                        // Variante di stile per il bottone di conferma
    confirmSvg                             // Icona SVG opzionale
}: PropType) {
    const [popup, setPopup] = useState(false); // Stato per controllare la visibilità del popup

    // Funzione per mostrare/nascondere il popup
    const togglePopup = () => setPopup((p) => !p);

    // Funzione per eseguire l'azione confermata e chiudere il popup
    const confirmAction = () => {
        onClick();       // Esegue la funzione fornita tramite `onClick`
        togglePopup();   // Chiude il popup
    };

    return (
        <>
            {/* Bottone principale */}
            <Button
                onClick={togglePopup}
                variant={variant}
                size={size}
                className={className}
            >
                {children} {/* Contenuto del bottone principale */}
            </Button>

            {/* Popup di conferma, visibile solo quando `popup` è true */}
            {popup && (
                <Popup
                    isOpen={popup}
                    close={togglePopup}
                    popupClass={popupClass}
                >
                    <h3 className="prompt-title">{popupTitle}</h3> {/* Titolo del popup */}
                    <p className="prompt-text">{popupText}</p>     {/* Testo esplicativo */}

                    {/* Bottone di conferma */}
                    <Button
                        variant={confirmVariant}        // Variante di stile
                        onClick={confirmAction}         // Esegue l'azione confermata
                        className={confirmClass}        // Classe CSS personalizzata
                    >
                        {confirmSvg} {confirmText}      {/* Icona e testo del bottone di conferma */}
                    </Button>
                </Popup>
            )}
        </>
    );
}

export default ButtonWithPrompt;