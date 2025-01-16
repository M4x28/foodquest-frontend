import React, { useState } from 'react';

import {ReactComponent as BillIcon} from "../assets/bill.svg" ;
import Total from '../components/Total.tsx';

import "./page.css";
import "./checkPage.css";

function CheckPage (){

    return (
        <div className='page-box-bg check-page'>
            <BillIcon/>
            <h1>Richiesta conto effettuata</h1>
            <p>Il conto arriverà a breve</p>
            <Total className='check-total'/>
        </div>
    );
};

export default CheckPage;