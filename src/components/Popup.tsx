import React from "react"

import { ReactComponent as CloseIcon } from "../assets/close.svg"
import { stopPropagation } from "../utility/generic.ts";

import "./Popup.css"

interface PropType{
    children: React.ReactNode,
    isOpen: boolean,
    close: () => void,

    closeBtn?: boolean,
    containerClass?: string,
    popupClass?: string,
    blurPage?: boolean,
  }

function Popup({isOpen, close, children, blurPage=true, closeBtn = true,
                containerClass = "popup-overlay", popupClass = "popup-content"}:PropType){
    
    if(!isOpen){
        containerClass = "solid-snake";
    }

    if(blurPage){
        containerClass += " glass";
    }

    return(
        <div className={containerClass} onClick={close}>
            <div className={popupClass} onClick = {stopPropagation}>
                {closeBtn && 
                    <button className = "close-btn" onClick={close} title="close">
                        <CloseIcon/>
                    </button>
                }
                {children}
            </div>
        </div>
    )
}

export default Popup;