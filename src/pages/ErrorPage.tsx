import React from 'react';
import "./page.css";

import {ReactComponent as ErrorIcon} from "../assets/error.svg" ;

interface PropType {
    errorTitle?: string,
    errorMessage?: string,
}

const defaultTitle = ":-/ Qualcosa è andato storto";
const defaultMessage = "Si è verificato un errore. Per favore, riprova."

function ErrorPage ({ errorTitle = defaultTitle, errorMessage = defaultMessage}:PropType){
    return (
        <div className='page-box-bg err-page'>
            <ErrorIcon/>
            <h1>{errorTitle}</h1>
            <p>{errorMessage}</p>
            <button className="light-btn retry-btn" onClick={() => window.location.reload()}>
                Riprova
            </button>
        </div>
    );
};

export default ErrorPage;