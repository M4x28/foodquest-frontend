import React, { useState } from "react";

interface PropType {
    className?: string;           // Css class for stying button
    OnClick?: () => void;         // On click handler
    animated?: boolean;           // Enable or disable animation
    animationClass?: string;      // Css class containing the animation, must have an animation specified
    children?: React.ReactNode;   // Button content
}

/**
 * Componente `AnimatedButton`.
 * Un pulsante personalizzato che supporta animazioni al click.
 * 
 * @param {string} [className=""] - Classe CSS per lo stile.
 * @param {() => void} [OnClick=() => {}] - Funzione chiamata al click sul pulsante.
 * @param {boolean} [animated=true] - Abilita o disabilita l'animazione al click.
 * @param {string} [animationClass] - Classe CSS per definire l'animazione. Deve avere un animazione al suo interno
 * @param {React.ReactNode} [children] - Contenuto del pulsante.
 */
function AnimatedButton({
    className = "",
    OnClick = () => {},
    animated = true,
    animationClass,
    children
}: PropType) {

    const [anim, setAnim] = useState(false);    //Current state of animation

    //Class name of button based on the animation status
    const btnClass: string = className + (anim ? " " + animationClass : "");    

    //Handle click starting animation
    const onBtnClick = () => {
        if (!anim && animated) {
            setAnim(true);
        }
        //Execute on click only if animation is not playing
        if (!anim) {
            OnClick(); 
        }
    };

    //Reset animation status on animation end
    const onAnimEnd = () => {
        if (anim) {
            setAnim(false);
        }
    };

    return (
        <button
            className={btnClass}               
            onClick={onBtnClick}               
            onAnimationEnd={onAnimEnd}
        >
            {children}
        </button>
    );
}

export default AnimatedButton;