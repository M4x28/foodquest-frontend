import React, { useState } from 'react';

import {ReactComponent as BillIcon} from "../assets/bill.svg" ;

import "./page.css";
import "./checkPage.css";
import { Total } from './ContoPage.tsx';

function CheckPage (){

    const [total,setTotal] = useState(0);
    const [discount,setDiscount] = useState(0);

    return (
        <div className='page-box-bg check-page'>
            <BillIcon/>
            <h1>Richiesta conto effettuata</h1>
            <p id='desk'>Il conto arriverà a breve</p>
            <Total total={total} discount={discount} className='check-total'/>
        </div>
    );
};

export default CheckPage;