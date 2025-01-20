import React, { useContext, useEffect, useState } from 'react';

// Importa l'icona della fattura
import { ReactComponent as BillIcon } from "../assets/bill.svg";

// Importa il componente `Total` per visualizzare il totale e lo sconto
import Total from '../components/utility/Total.tsx';

import "./page.css";
import "./checkPage.css";

// Importa il contesto dell'applicazione e il connettore del server backend
import { AppStateCtx, backendServer } from '../App.tsx';

/**
 * Componente per la pagina di richiesta del conto.
 */
function CheckPage() {

    // Recupera lo stato dell'applicazione dal contesto globale
    // eslint-disable-next-line
    const [appState, _] = useContext(AppStateCtx);

    // Stato locale per gestire il totale e lo sconto
    const [{ total, discount }, setTotal] = useState<{ total: number, discount: number }>({
        total: 0,      // Totale iniziale
        discount: 0    // Sconto iniziale
    });

    // Effettua il fetch del totale e dello sconto quando il componente è montato o `appState.table` cambia
    useEffect(() => {
        backendServer.table.fetchTotal(appState.table) // Recupera i dati relativi al conto
            .then(setTotal); // Aggiorna lo stato con il totale e lo sconto ricevuti
    }, [appState.table]); // Dipendenza: aggiorna quando cambia il tavolo nel contesto globale

    return (
        <div className='check-page'>
            {/* Intestazione della pagina */}
            <header className='page-box-bg'>
                <BillIcon /> {/* Icona della fattura */}
                <h1>Richiesta conto effettuata</h1> {/* Titolo della pagina */}
            </header>

            {/* Messaggio informativo */}
            <p>Il conto arriverà a breve</p>

            {/* Componente per visualizzare il totale e lo sconto */}
            <Total total={total} discount={discount} className='check-total' />
        </div>
    );
};

export default CheckPage;