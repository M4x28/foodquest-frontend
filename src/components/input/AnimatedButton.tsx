import React, { useState } from "react";

// Definizione delle proprietà accettate dal componente AnimatedButton
interface PropType {
    className?: string;           // Classe CSS aggiuntiva per lo stile (opzionale)
    OnClick?: () => void;         // Callback per il click del pulsante (opzionale)
    animated?: boolean;           // Flag per abilitare/disabilitare l'animazione (default: true)
    animationClass?: string;      // Classe CSS per l'animazione (opzionale)
    children?: React.ReactNode;   // Contenuto del pulsante (es. testo o icone)
}

/**
 * Componente `AnimatedButton`.
 * Un pulsante personalizzato che supporta animazioni al click.
 * 
 * @param {string} [className=""] - Classe CSS aggiuntiva per lo stile.
 * @param {() => void} [OnClick=() => {}] - Funzione chiamata al click sul pulsante.
 * @param {boolean} [animated=true] - Abilita o disabilita l'animazione al click.
 * @param {string} [animationClass] - Classe CSS per definire l'animazione.
 * @param {React.ReactNode} [children] - Contenuto del pulsante.
 */
function AnimatedButton({
    className = "",
    OnClick = () => { },
    animated = true,
    animationClass,
    children
}: PropType) {

    // Stato per gestire se l'animazione è attiva o no
    const [anim, setAnim] = useState(false);

    // Combina la classe base con la classe di animazione se attiva
    const btnClass: string = className + (anim ? " " + animationClass : "");

    /**
     * Gestisce il click sul pulsante.
     * Attiva l'animazione se non è già attiva e `animated` è abilitato.
     * Chiama la funzione `OnClick` solo se l'animazione non è in corso.
     */
    const onBtnClick = () => {
        if (!anim && animated) {
            setAnim(true); // Attiva l'animazione
        }
        if (!anim) {
            OnClick(); // Esegue la funzione associata al click
        }
    };

    /**
     * Gestisce il termine dell'animazione.
     * Resetta lo stato dell'animazione quando questa finisce.
     */
    const onAnimEnd = () => {
        if (anim) {
            setAnim(false); // Disattiva l'animazione
        }
    };

    return (
        <button
            className={btnClass}               // Applica le classi CSS al pulsante
            onClick={onBtnClick}               // Gestisce il click sul pulsante
            onAnimationEnd={onAnimEnd}         // Gestisce il termine dell'animazione
        >
            {children} {/* Contenuto del pulsante */}
        </button>
    );
}

export default AnimatedButton;