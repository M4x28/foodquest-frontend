import React from "react";

interface InputProps {
    type: string; // Tipo di input, es. 'text', 'email', 'password'
    placeholder: string; // Testo segnaposto
    style?: React.CSSProperties; // Stili personalizzati opzionali
    className?: string; // Classe CSS opzionale
    value?: string; // Valore input

    error?: string; // Messaggio di errore
    errorStyle?: React.CSSProperties;
    errorClass?: string;

    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Gestore del cambiamento
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void; // Gestore del focus
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Gestore della perdita di focus
}

const Input: React.FC<InputProps> = ({ type, placeholder, style, className, value, error, errorClass, errorStyle, onChange, onFocus, onBlur, }) => {
    // Stile predefinito
    const defaultStyle: React.CSSProperties = {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Ombra
        padding: "10px", // Padding dinamico
        borderRadius: "1.5rem", // Angoli arrotondati
        border: "1px solid #ced4da", // Bordo di default
        fontSize: "1.5rem", // Font size dinamico
        width: "90vw", // Adattamento dinamico alla larghezza dello schermo
        maxWidth: "300px", // Limite massimo della larghezza
    };

    const errorDefaultStyle: React.CSSProperties = {
        color: "#b30000",
        fontSize: "1.2rem",
        fontWeight: "bold",
        padding: "0px 1rem",
        width: "90vw",
        maxWidth: "300px",
    }

    return (
        <>
        { error && 
            <label 
                style={{...errorDefaultStyle,...style}} 
                className={errorClass}>
                {error}
            </label>
        }
        <input
            type={type}
            value={value}
            className={`form-control ${className || ""}`} // Supporto per classi CSS opzionali
            placeholder={placeholder}
            style={{ ...defaultStyle, ...style }} // Unione di stili predefiniti e personalizzati
            onChange={onChange} // Callback opzionale per il cambiamento
            onFocus={onFocus} // Callback opzionale per il focus
            onBlur={onBlur} // Callback opzionale per la perdita di focus
        />
        </>
    );
};

export default Input;
