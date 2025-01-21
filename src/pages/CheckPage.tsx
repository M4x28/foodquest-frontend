import React, { useContext, useEffect, useState } from 'react';
import { AppStateCtx, backendServer } from '../App.tsx';
import Total from '../components/utility/Total.tsx';

import { ReactComponent as BillIcon } from "../assets/bill.svg";

import "./page.css";
import "./checkPage.css";

/**
 * Componente per la pagina di richiesta del conto.
 */
function CheckPage() {

    // eslint-disable-next-line
    const [appState, _] = useContext(AppStateCtx);

    // Stato locale per gestire il totale e lo sconto
    const [{ total, discount }, setTotal] = useState<{ total: number, discount: number }>( {total: 0, discount: 0 });

    //Fetch total from backend server on mount
    useEffect(() => {
        backendServer.table.fetchTotal(appState.table)
            .then(setTotal);
    }, [appState.table]); //Dependecy in this state should never change, but better safe than sorry

    return (
        <div className='check-page'>
            <header className='page-box-bg'>
                <BillIcon />
                <h1>Richiesta conto effettuata</h1>
            </header>

            <p>Il conto arriverà a breve</p>

            <Total total={total} discount={discount} className='check-total' />
        </div>
    );
};

export default CheckPage;