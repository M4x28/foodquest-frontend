// Concept for a page wrapper
import React from 'react';
import "./page.css"
import ErrorPage from './ErrorPage.tsx';

export interface Error{
    error:boolean

    errorTitle?:string;
    errorMessage?:string;
}

interface PropType {
    children?: React.ReactNode;
    error?: Error;
}

function Page ({ children, error}:PropType){
    
    if(!error || !error.error)
        return (
            <div className='page'>
                {children}
            </div>
        );
    else
        return <ErrorPage errorMessage={error.errorMessage} errorTitle={error.errorTitle}/>
};

export default Page;
