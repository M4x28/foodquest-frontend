import React from "react"; // Importa React

// Interfaccia per definire le proprietà del componente Input
interface InputProps {
    type: string; // Tipo di input, es. 'text', 'email', 'password'
    placeholder: string; // Testo segnaposto che appare nel campo
    style?: React.CSSProperties; // Stili personalizzati opzionali per il campo
    className?: string; // Classe CSS opzionale per lo stile del campo
    value?: string; // Valore dell'input, può essere controllato esternamente

    error?: string; // Messaggio di errore opzionale da mostrare sopra il campo
    errorStyle?: React.CSSProperties; // Stili personalizzati per il messaggio di errore
    errorClass?: string; // Classe CSS opzionale per il messaggio di errore

    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Callback per gestire il cambiamento del valore
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void; // Callback per gestire l'evento di focus
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Callback per gestire l'evento di perdita del focus
}

// Componente Input
const Input: React.FC<InputProps> = ({
    type, // Tipo di input (es. 'text', 'password')
    placeholder, // Testo segnaposto
    style, // Stili personalizzati opzionali
    className, // Classe CSS opzionale
    value, // Valore controllato
    error, // Messaggio di errore opzionale
    errorClass, // Classe CSS per lo stile del messaggio di errore
    errorStyle, // Stile personalizzato per il messaggio di errore
    onChange, // Callback per il cambiamento del valore
    onFocus, // Callback per l'evento di focus
    onBlur, // Callback per l'evento di perdita di focus
}) => {
    // Stile predefinito per il campo input
    const defaultStyle: React.CSSProperties = {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Aggiunge un'ombra leggera
        padding: "10px", // Spaziatura interna
        borderRadius: "1.5rem", // Angoli arrotondati
        border: "1px solid #ced4da", // Bordo di default
        fontSize: "1.5rem", // Dimensione del font
        width: "90vw", // Adattamento dinamico alla larghezza dello schermo
        maxWidth: "300px", // Larghezza massima
    };

    // Stile predefinito per il messaggio di errore
    const errorDefaultStyle: React.CSSProperties = {
        color: "#b30000", // Colore rosso per evidenziare l'errore
        fontSize: "1rem", // Dimensione del font del messaggio di errore
        fontWeight: "bold", // Testo in grassetto
        padding: "0px 1rem", // Spaziatura interna orizzontale
        width: "90vw", // Adattamento dinamico alla larghezza dello schermo
        maxWidth: "300px", // Larghezza massima
    };

    return (
        <>
            {/* Mostra il messaggio di errore se esiste */}
            {error &&
                <label
                    style={{ ...errorDefaultStyle, ...errorStyle }} // Unisce lo stile predefinito con eventuali stili personalizzati
                    className={errorClass} // Applica una classe CSS opzionale per il messaggio di errore
                >
                    {error} {/* Testo del messaggio di errore */}
                </label>
            }
            <input
                type={type} // Specifica il tipo di input (es. 'text', 'email', 'password')
                value={value} // Valore dell'input
                className={`form-control ${className || ""}`} // Applica la classe CSS 'form-control' e altre classi opzionali
                placeholder={placeholder} // Testo segnaposto del campo
                style={{ ...defaultStyle, ...style }} // Combina gli stili predefiniti con eventuali stili personalizzati
                onChange={onChange} // Esegue la funzione callback quando il valore cambia
                onFocus={onFocus} // Esegue la funzione callback quando l'input riceve il focus
                onBlur={onBlur} // Esegue la funzione callback quando l'input perde il focus
            />
        </>
    );
};

export default Input; // Esporta il componente Input per essere utilizzato in altre parti dell'applicazione
