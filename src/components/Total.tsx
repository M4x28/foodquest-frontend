import { useContext } from "react";
import { AppStateCtx, backendServer } from "../App.tsx";
import useRefresh from "../utility/useRefresh.ts";
import React from "react";
import { formatPrice } from "../utility/generic.ts";

export default function Total({className}:{className?:string}){

    // eslint-disable-next-line
    const [appState,_] = useContext(AppStateCtx);

    // eslint-disable-next-line
    const [{total,discount},__] = useRefresh<{total:number,discount:number}>( async () => {

        if(!appState.table){
            return {total:NaN,discount:0};
        }

        return await backendServer.fetchTotal(appState.table);
    },
    {total:0,discount:0}, 20000, [appState.table]);


if(!discount || discount === 0){
    return(
        <p className={className}>
            <strong className='font-weight-bold'>Totale</strong>
            : {formatPrice(total)}€
        </p>
    );
}
else{
    return(
        <p className={className}>
            <strong className='font-weight-bold'>Totale</strong>
            : <span className='discounted-price'>{formatPrice(total)} € </span> 
            {formatPrice(total - discount)} €
        </p>
    );
}
}