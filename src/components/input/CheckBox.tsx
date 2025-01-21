import React, { ChangeEventHandler } from 'react';

import { ReactComponent as TicIcon } from "../../assets/tic.svg";

import "./checkBox.css";

interface PropType {
    value: boolean;               // Current checkbox value (Checked or not)
    onChange: ChangeEventHandler; // On change event handler
    text: string;                 // Checkbox text description
    className?: string;           // Css class for extra styling
}

/**
 * Componente per un checkbox personalizzato con testo e icona di spunta.
 * 
 * @param {boolean} value - Stato attuale del checkbox.
 * @param {ChangeEventHandler} onChange - Callback per gestire il cambio di stato.
 * @param {string} text - Testo descrittivo accanto al checkbox.
 * @param {string} [className=""] - Classe CSS aggiuntiva per lo stile (default: stringa vuota).
 */
function CheckBox({ value, onChange, text, className = "" }: PropType) {
    return (
        <label className={"check-box " + className}>
            <input
                checked={value}
                type="checkbox"
                onChange={onChange}
            />
            {/* Checkbox display (true checkbox is hidden, easier to style)*/}
            <span className='tic-container'>
                <TicIcon />
            </span>
            
            {text}
        </label>
    );
}

export default CheckBox;