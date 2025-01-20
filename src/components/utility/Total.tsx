import React from "react";
import { formatPrice } from "../../utility/generic.ts"; // Importa la funzione di utilità per formattare i prezzi

/**
 * Componente `Total`.
 * Mostra il totale e, se presente, un eventuale sconto applicato.
 * 
 * @param {number} total - Totale originale senza sconti.
 * @param {number} [discount=0] - Sconto applicato al totale. Default: 0.
 * @param {string} [className] - Classe CSS opzionale per lo stile del componente.
 */
export default function Total({ total, discount = 0, className }: { total: number, discount: number, className?: string }) {

    // Caso in cui non è presente alcuno sconto
    if (!discount || discount === 0) {
        return (
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong> {/* Etichetta per il totale */}
                : {formatPrice(total)}€ {/* Totale formattato */}
            </p>
        );
    }
    // Caso in cui è presente uno sconto
    else {
        return (
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong> {/* Etichetta per il totale */}
                : <span className='discounted-price'>{formatPrice(total)} € </span> {/* Totale originale barrato */}
                {formatPrice(total - discount)} € {/* Totale finale dopo lo sconto */}
            </p>
        );
    }
}