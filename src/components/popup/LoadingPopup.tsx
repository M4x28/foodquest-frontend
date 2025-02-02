import React from 'react';
import Popup from './Popup.tsx';

import {ReactComponent as SpinnerIcon} from "../../assets/loading.svg";

import "./loading.css";

function LoadingPopup({loading}) {
    return (
        <Popup isOpen={loading} close={() => 0} closeBtn={false} popupClass='popup-content load'>
            <SpinnerIcon className="loading-icon spin"/>
            <h3 className='loading-text'>Loading</h3>
        </Popup>
    );
}

export default LoadingPopup;