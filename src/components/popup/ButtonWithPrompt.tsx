import React, { useState } from 'react';
import { Button } from '../input/Button.tsx';
import Popup from './Popup.tsx';
import "./ConfirmPrompt.css";

interface PropType {
    children: React.ReactNode;        // Button content
    onClick: () => void;              // Action to perform on acceptance
    className?: string;               // Button css class
    variant?: string;                 // Button color variant
    size?: string;                    // Button size variant
    popupClass?: string;              // Custom CSS class for popup componet
    confirmClass?: string;            // Custom CSS class for confirm btn
    popupTitle?: string;              // Title of the popup prompt
    popupText?: string;               // Text of the popup prompt
    confirmText?: string;             // Text of the confirm btn
    confirmSvg?: React.ReactElement;  // Optional icon for confirm button
    confirmVariant?: string;          // Button color variant for confirm btn
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
    confirmClass = "confirm-btn",
    popupTitle = "Sei sicuro?",            
    popupText = "Questa azione non può essere annullata",
    confirmText = "CONFERMA",             
    confirmVariant,                        
    confirmSvg                             
}: PropType) {
    
    const [popup, setPopup] = useState(false);

    const togglePopup = () => setPopup((p) => !p);

    //Function to exectute on user confirm (excute action and closes popup)
    const confirmAction = () => {
        onClick();
        togglePopup();
    };

    return (
        <>
            <Button
                onClick={togglePopup}
                variant={variant}
                size={size}
                className={className}
            >
                {children}
            </Button>

            <Popup isOpen={popup} close={togglePopup} popupClass={popupClass}>
                <h3 className="prompt-title">{popupTitle}</h3>
                <p className="prompt-text">{popupText}</p>

                <Button variant={confirmVariant} onClick={confirmAction} className={confirmClass}>
                    {confirmSvg} {confirmText}
                </Button>
            </Popup>
        </>
    );
}

export default ButtonWithPrompt;