import React, { ChangeEventHandler } from 'react';

import { ReactComponent as TicIcon } from "../../assets/tic.svg"

import "./checkBox.css"

interface PropType{
    value:boolean,
    onChange:ChangeEventHandler,
    text:string,
    className?: string
}

function CheckBox({value,onChange,text,className=""}:PropType) {
    return (
        <label className={"check-box " + className}>
            <input checked={value} type="checkbox" onChange={onChange}/>
            <span className='tic-container'><TicIcon/></span> 
            {text}
        </label>
    );
}

export default CheckBox;