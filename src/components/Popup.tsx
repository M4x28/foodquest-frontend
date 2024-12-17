import React from "react"

import { ReactComponent as CloseIcon } from "../assets/close.svg"

import "./Popup.css"

interface PropType{
    children?: React.ReactNode,
    open: boolean,
    close: Function,

    closeBtn?: boolean,
    containerClass?: string,
    popupClass?: string,
    blurPage?: boolean,
  }

function Popup({open, close, children, blurPage=true, closeBtn = true,
                containerClass = "popup-overlay", popupClass = "popup-content"}:PropType){
    
    if(!open){
        containerClass = "solid-snake";
    }

    if(blurPage){
        containerClass += " glass";
    }

    return(
        <div className={containerClass} onClick={close}>
            <div className={popupClass} onClick = {(event:Event) => event.stopPropagation()}>
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