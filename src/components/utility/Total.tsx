import React from "react";
import { formatPrice } from "../../utility/generic.ts";

/**
 * Componente `Total`.
 * Mostra il totale e, se presente, un eventuale sconto applicato.
 * 
 * @param {number} total - Totale originale senza sconti.
 * @param {number} [discount=0] - Sconto applicato al totale. Default: 0.
 * @param {string} [className] - Classe CSS opzionale per lo stile del componente.
 */
export default function Total({ total, discount = 0, className }: { total: number, discount: number, className?: string }) {

    if (!discount || discount === 0) {
        // if discount is not present
        return (
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong>: {formatPrice(total)}€
            </p>
        );
    }
    else {
        // if discount is present
        return (
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong> {/* Etichetta per il totale */}
                : <span className='discounted-price'>{formatPrice(total)} € </span> {/* Totale originale barrato */}
                {formatPrice(total - discount)} € {/* Totale finale dopo lo sconto */}
            </p>
        );
    }
}