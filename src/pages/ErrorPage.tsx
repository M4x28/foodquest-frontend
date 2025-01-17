import React from 'react';
import "./page.css";

import {ReactComponent as ErrorIcon} from "../assets/error.svg" ;
import { useNavigate } from 'react-router-dom';

interface PropType {
    errorTitle?: string,
    errorMessage?: string,
    retryBtn?: boolean,
}

const defaultTitle = ":-/ Qualcosa è andato storto";
const defaultMessage = "Si è verificato un errore. Per favore, riprova."

function ErrorPage ({ errorTitle = defaultTitle, errorMessage = defaultMessage, retryBtn = true}:PropType){
    
    const navigate = useNavigate();

    return (
        <div className='page-box-bg err-page'>
            <ErrorIcon/>
            <h1>{errorTitle}</h1>
            <p>{errorMessage}</p>
            {
                retryBtn && 
                <button className="light-btn retry-btn" onClick={() => navigate(-1)}>
                    Riprova
                </button>
            }
        </div>
    );
};

export default ErrorPage;