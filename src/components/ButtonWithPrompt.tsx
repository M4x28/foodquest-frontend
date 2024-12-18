import React,{useState} from "react"
import Popup from "./Popup.tsx";

import {ReactComponent as ConfirmIcon} from "../assets/confirm.svg"

import "./ConfirmPrompt.css"

interface PropType{
    //Functional
    children: React.ReactNode,
    onClick: () => void, 
    //Aestetic
    className?:string,
    //Popup Aestetic
    popupClass?:string,
    confirmClass?:string,
    popupTitle?:string,
    popupText?:string,
    confirmText?:string,
    confirmSvg?: React.ReactElement
}

function ButtonWithPrompt({children, onClick, className, popupClass, confirmClass = "dark-btn confirm-btn",
        popupTitle = "Sei sicuro?", popupText = "Questa azione non può essere annullata",
        confirmText = "CONFERMA", confirmSvg=<ConfirmIcon/> } : PropType){

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
        <Popup isOpen={popup} close={togglePopup} popupClass={popupClass}>
            <h3 className="prompt-title"> {popupTitle} </h3>
            <p  className="prompt-text"> {popupText} </p>
            <button className={confirmClass} onClick={confirmAction}>
                {confirmSvg} {confirmText}
            </button>
        </Popup>
        </>
    )

}

export default ButtonWithPrompt;