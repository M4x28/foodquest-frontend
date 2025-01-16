import React, { useContext, useState } from 'react';
import Page, { Error } from './Page.tsx';
import Header, { Pages } from '../components/Header.tsx';
import useRefresh from '../utility/useRefresh.ts';
import { AppStateCtx } from '../App.tsx';
import ButtonWithPrompt from '../components/ButtonWithPrompt.tsx';
import OrderCard from '../components/orderCard.tsx';

import { ReactComponent as CloseIcon } from "../assets/close.svg"

import "./orderPage.css"
import { formatPrice } from '../utility/generic.ts';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../App.tsx';
import { order } from '../server/server.ts';

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
    
    const [error,setError] = useState<Error>( {error:false} );

    //Fetch table order periodicalliy
    // eslint-disable-next-line
    const [orders,__] = useRefresh<order[]>(async () => {

        if(!appState.table){
            setError({error:true,
                errorTitle: "Dati tavolo mancanti",
                errorMessage: "Riprova a scansionare il qr, i dati potrebbero essersi persi"
            })
            return [];
        }

        return await backendServer.fetchOrdersDone(appState.table)
            .catch((err) => {
            console.log(err);
            if(err.status === 401){
                setError({error:true,
                    errorTitle:"Sessione invalida",
                    errorMessage:"Le informazioni ruguardo al tavolo sono invalide, Prova a riscansionare il QR-code"})
            }else{
            setError({error:true,
                        errorTitle:"Connessione al server fallita",
                        errorMessage:"Controlla la tua connessione a internet e riprova"})
            }
            return [];
        })

    },[],20000);

    // eslint-disable-next-line
    const [total,___] = useRefresh<{total:number,discount:number}>( async () => {

        if(!appState.table){
            setError({error:true,
                errorTitle: "Dati tavolo mancanti",
                errorMessage: "Riprova a scansionare il qr, i dati potrebbero essersi persi"
            })
            return {total:0,discount:0};
        }

        return await backendServer.fetchTotal(appState.table);
    },
    {total:0,discount:0}, 20000, [appState.table]);

    //Can request check only if there are more than 1 order and there aren't any not done Order
    const canRequestCheck = orders.length > 0 && orders.filter(o => o.status !== "Done").length === 0;

    //Function to request check
    const checkRequest = async () => {
        if(!canRequestCheck){
            return;
        }else{
            backendServer.askForCheck(appState.table)
            .then(() => {
                console.log("Richiesta conto effettuata");
                navigate("/check");
            }).catch((err) => {
                console.log(err);
                if(err.status === 401){
                    setError({error:true,
                        errorTitle:"Sessione invalida",
                        errorMessage:"Le informazioni ruguardo al tavolo sono invalide, Prova a riscansionare il QR-code"})
                }else{
                setError({error:true,
                            errorTitle:"Connessione al server fallita",
                            errorMessage:"Controlla la tua connessione a internet e riprova"})
                }
                return [];
            })
        }
    };

    const checkText = canRequestCheck ? "Questa azione non può essere annullata, sei sicuro?" :
                    "Impossibile richiedere il conto, non hai ancora ricevuto tutti gli ordini";

    return (
        <Page error={error}>
            <Header pageName='Conto' current={Pages.Check}/>
            <section className='orders-container'>
                {orders.map((order,index) => <OrderCard key={order.documentId} order={order} index={index+1}/>)}
            </section>
            <Total total={total.total} discount={total.discount} className='total'/>
            <ButtonWithPrompt onClick={checkRequest} className='dark-btn check-btn'
                popupTitle='Chiedi il conto' popupText={checkText}
                confirmText={canRequestCheck ? undefined : "CHIUDI"} confirmClass={canRequestCheck ? undefined : 'err-btn confirm-btn'} 
                confirmSvg={canRequestCheck ? undefined : <CloseIcon/>}>
                Chiedi il conto
            </ButtonWithPrompt>
        </Page>
    );
}

export default ContoPage;

export function Total({className}:{className?:string}){

        // eslint-disable-next-line
        const [appState,_] = useContext(AppStateCtx);

        // eslint-disable-next-line
        const [{total,discount},__] = useRefresh<{total:number,discount:number}>( async () => {

            if(!appState.table){
                return {total:NaN,discount:0};
            }
    
            return await backendServer.fetchTotal(appState.table);
        },
        {total:0,discount:0}, 20000, [appState.table]);


    if(!discount || discount === 0){
        return(
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong>
                : {formatPrice(total)}€
            </p>
        );
    }
    else{
        return(
            <p className={className}>
                <strong className='font-weight-bold'>Totale</strong>
                : <span className='discounted-price'>{formatPrice(total)} € </span> 
                {formatPrice(total - discount)} €
            </p>
        );
    }
}