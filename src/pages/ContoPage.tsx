import React, { useContext, useEffect, useState } from 'react';
import Page from './Page.tsx';
import Header, { Pages } from '../components/utility/Header.tsx';
import useRefresh from '../utility/useRefresh.ts';
import { AppStateCtx } from '../App.tsx';
import ButtonWithPrompt from '../components/popup/ButtonWithPrompt.tsx';
import OrderCard from '../components/card/orderCard.tsx';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../App.tsx';
import { order } from '../server/server.ts';
import Total from '../components/utility/Total.tsx';

import { ReactComponent as CloseIcon } from "../assets/close.svg"
import "./contoPage.css"
import CheckBox from '../components/input/CheckBox.tsx';
import { toErrorPage } from '../utility/generic.ts';

export interface Order{
    documentId:string,
    status:string,
    time:number,
    products:any[];
}

function ContoPage() {

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [appState,_] = useContext(AppStateCtx);
    
    const [usingPoint,setUsingPoint] = useState(false);
    const [point,setPoint] = useState(0);

    useEffect(() => {
        if(appState.user){
            backendServer.fc.fetchMaxPoint(appState.user.user.documentId)
            .then(setPoint)
            .catch(e => {
                console.log(e);
                toErrorPage(navigate);
            })
        }
    },[appState.user]);

    //Fetch table order periodicalliy
    // eslint-disable-next-line
    const [orders,__] = useRefresh<order[]>(async () => {

        if(!appState.table){
            toErrorPage(navigate);
            return [];
        }

        return await backendServer.orders.fetchOrdersDone(appState.table)
            .catch((err) => {
            console.log(err);
            toErrorPage(navigate);
            return [];
        })

    },[],20000);

    // eslint-disable-next-line
    const [{total,discount},reloadTotal] = useRefresh<{total:number,discount:number}>( async () => {

        if(!appState.table){
            toErrorPage(navigate);
            return {total:0,discount:0};
        }

        return await backendServer.table.fetchTotal(appState.table);
    },
    {total:0,discount:0}, 20000, [appState.table]);

    //Can request check only if there are more than 1 order and there aren't any not done Order
    const canRequestCheck = orders.length > 0 && orders.filter(o => o.status !== "Done").length === 0;

    //Function to request check
    const checkRequest = async () => {
        if(!canRequestCheck){
            return;
        }else{
            backendServer.table.askForCheck(appState.table)
            .then(() => {
                console.log("Richiesta conto effettuata");
                navigate("/check");
            }).catch((err) => {
                console.log(err);
                toErrorPage(navigate);
                return [];
            })
        }
    };

    const handlePointUsageChange = () => {
        const newUsePoint = !usingPoint
        backendServer.fc.setPointUsage(appState.user.user.documentId,newUsePoint)
        .then(() => {
            setUsingPoint(newUsePoint)
            reloadTotal();
        })
        .catch(e => {
            console.log(e);
            toErrorPage(navigate);
        })
    }

    const checkText = canRequestCheck ? "Questa azione non può essere annullata, sei sicuro?" :
                    "Impossibile richiedere il conto, non hai ancora ricevuto tutti gli ordini";

    return (
        <Page>
            <Header pageName='Conto' current={Pages.Check}/>
            <section className='orders-container'>
                {orders.map((order,index) => <OrderCard key={order.documentId} order={order} index={index+1}/>)}
            </section>
            {appState.user && 
                <CheckBox value={usingPoint} text={"Usa " + point + " punti"} className='toggle-point'
                    onChange={handlePointUsageChange}/>
            }
            <Total total={total} discount={discount} className='total'/>
            <ButtonWithPrompt onClick={checkRequest} className='check-btn'
                popupTitle='Chiedi il conto' popupText={checkText}
                confirmText={canRequestCheck ? undefined : "CHIUDI"} confirmClass={canRequestCheck ? undefined : 'err-btn confirm-btn'} 
                confirmSvg={canRequestCheck ? undefined : <CloseIcon/>}>
                Chiedi il conto
            </ButtonWithPrompt>
        </Page>
    );
}

export default ContoPage;