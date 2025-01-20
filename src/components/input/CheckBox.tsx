import React, { ChangeEventHandler } from 'react';

// Importa l'icona per il segno di spunta
import { ReactComponent as TicIcon } from "../../assets/tic.svg";

// Importa lo stile per il componente CheckBox
import "./checkBox.css";

// Definizione delle proprietà accettate dal componente CheckBox
interface PropType {
    value: boolean;               // Stato attuale del checkbox (selezionato o no)
    onChange: ChangeEventHandler; // Funzione da eseguire quando il valore cambia
    text: string;                 // Testo da visualizzare accanto al checkbox
    className?: string;           // Classe CSS aggiuntiva per lo stile (opzionale)
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
        <label className={"check-box " + className}> {/* Contenitore principale con classe CSS */}
            {/* Input checkbox con stato controllato */}
            <input
                checked={value}       // Imposta lo stato attuale del checkbox
                type="checkbox"       // Tipo di input
                onChange={onChange}   // Callback per il cambio di stato
            />
            {/* Contenitore per il segno di spunta */}
            <span className='tic-container'>
                <TicIcon /> {/* Icona del segno di spunta */}
            </span>
            {text} {/* Testo descrittivo accanto al checkbox */}
        </label>
    );
}

export default CheckBox;