import React, { useState } from 'react';

import {ReactComponent as BillIcon} from "../assets/bill.svg" ;

import "./page.css";
import "./checkPage.css";
import { Total } from './ContoPage.tsx';

function CheckPage (){

    return (
        <div className='page-box-bg check-page'>
            <BillIcon className=""/>
            <h1>Richiesta conto effettuata</h1>
            <p id='desk'>Il conto arriverà a breve</p>
            <Total className='check-total'/>
        </div>
    );
};

export default CheckPage;