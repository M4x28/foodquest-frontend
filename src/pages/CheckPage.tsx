import React, { useContext, useEffect, useState } from 'react';

import {ReactComponent as BillIcon} from "../assets/bill.svg" ;
import Total from '../components/utility/Total.tsx';

import "./page.css";
import "./checkPage.css";
import { AppStateCtx, backendServer } from '../App.tsx';

function CheckPage (){

    // eslint-disable-next-line
    const [appState,_] = useContext(AppStateCtx);
    const [{total,discount},setTotal] = useState<{total:number,discount:number}>({total:0,discount:0});

    useEffect(() =>{

        backendServer.table.fetchTotal(appState.table)
            .then(setTotal);

    },[appState.table]);
    
    return (
        <div className='check-page'>
            <header className='page-box-bg'>
                <BillIcon/>
                <h1>Richiesta conto effettuata</h1>
            </header>
            <p>Il conto arriverà a breve</p>
            <Total total={total} discount={discount} className='check-total'/>
        </div>
    );
};

export default CheckPage;