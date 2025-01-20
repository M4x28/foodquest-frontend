import React from "react";
import { formatPrice } from "../../utility/generic.ts";

export default function Total({ total, discount = 0, className }: { total: number, discount: number, className?: string }) {

    if (!discount || discount === 0) {
        return (
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong>
                : {formatPrice(total)}€
            </p>
        );
    }
    else {
        return (
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong>
                : <span className='discounted-price'>{formatPrice(total)} € </span>
                {formatPrice(total - discount)} €
            </p>
        );
    }
}