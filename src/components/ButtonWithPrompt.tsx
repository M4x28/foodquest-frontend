import React, { useState } from 'react';
import { Button } from './Button.tsx'; // Importa il tuo componente Button
import Popup from './Popup.tsx';

import "./ConfirmPrompt.css";

interface PropType {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: string;
    size?: string;
    popupClass?: string;
    confirmClass?: string;
    popupTitle?: string;
    popupText?: string;
    confirmText?: string;
    confirmSvg?: React.ReactElement;
}

function ButtonWithPrompt({
    children,
    onClick,
    className,
    variant,
    size,
    popupClass,
    confirmClass = "dark-btn confirm-btn",
    popupTitle = "Sei sicuro?",
    popupText = "Questa azione non può essere annullata",
    confirmText = "CONFERMA",
    confirmSvg
}: PropType) {
    const [popup, setPopup] = useState(false);

    const togglePopup = () => setPopup((p) => !p);
    const confirmAction = () => {
        onClick();
        togglePopup();
    };

    return (
        <>
            <Button onClick={togglePopup} variant={variant} size={size} className={className}>
                {children}
            </Button>
            {popup && (
                <Popup isOpen={popup} close={togglePopup} popupClass={popupClass}>
                    <h3 className="prompt-title">{popupTitle}</h3>
                    <p className="prompt-text">{popupText}</p>
                    <Button
                        
                        onClick={confirmAction}
                        className={confirmClass}
                    >
                        {confirmSvg} {confirmText}
                    </Button>
                </Popup>
            )}
        </>
    );
}

export default ButtonWithPrompt;