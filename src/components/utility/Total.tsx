import React from "react";
import { formatPrice } from "../../utility/generic.ts";

export default function Total({ total, discount = 0, usingPoints = false, className }: { total: number, discount: number, usingPoints: boolean, className?: string }) {

    if (!discount || discount === 0 || !usingPoints) {
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