import React, { useState } from 'react';
import { formatPrice } from '../utility/generic.ts';

import {ReactComponent as BillIcon} from "../assets/bill.svg" ;

import "./page.css";
import "./checkPage.css";

function CheckPage (){

    const [total,setTotal] = useState(0);

    return (
        <div className='page-box-bg check-page'>
            <BillIcon/>
            <h1>Richiesta conto effettuata</h1>
            <p id='desk'>Il conto arriverà a breve</p>
            <p id="total"><strong>Totale</strong> : {formatPrice(total)} €</p>
        </div>
    );
};

export default CheckPage;