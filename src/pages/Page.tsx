// Concept for a page wrapper
import React from 'react';
import "./page.css"

export interface Error{
    error:boolean

    errorTitle?:string;
    errorMessage?:string;
}

interface PropType {
    children?: React.ReactNode;
}

function Page ({ children }:PropType){
    return (
        <div className='page'>
            {children}
        </div>
    );
};

export default Page;
