// Concept for a page wrapper
import React from 'react';
import "./page.css"
import ErrorPage from './ErrorPage.tsx';

interface PropType {
    children?: React.ReactNode;
    error?:boolean;

    errorTitle?:string;
    errorMessage?:string;
}

function Page ({ children, error = false, errorTitle, errorMessage}:PropType){
    
    if(!error)
        return (
            <div className='page'>
                {children}
            </div>
        );
    else
        return <ErrorPage errorMessage={errorMessage} errorTitle={errorTitle}/>
};

export default Page;
