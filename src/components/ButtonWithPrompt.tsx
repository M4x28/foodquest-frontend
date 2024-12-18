import React,{useState} from "react"
import Popup from "./Popup.tsx";

import {ReactComponent as ConfirmIcon} from "../assets/confirm.svg"

import "./ConfirmPrompt.css"

interface PropType{
    children: React.ReactNode,
    onClick: () => void, 

    className?:string,
    popupTitle?: string,
    popupText?: string,
}

function ButtonWithPrompt({children, onClick, className,
     popupTitle = "Sei sicuro?", popupText = "Questa azione non può essere annullata"} : PropType){

    const [popup,setPopup] = useState(false);

    const togglePopup = () => setPopup((p) => !p);
    const confirmAction = () => {
        onClick();
        togglePopup();
    }

    return(
        <>
        <button onClick={togglePopup} className={className}>
            {children}
        </button>
        <Popup isOpen={popup} close={togglePopup} popupClass="confirm-prompt">
            <h3> {popupTitle} </h3>
            <p> {popupText} </p>
            <button className="dark-btn confirm-btn" onClick={confirmAction}>
                <ConfirmIcon/> CONFERMA
            </button>
        </Popup>
        </>
    )

}

export default ButtonWithPrompt;