import React, { useContext, useState } from 'react';
import Page, { Error } from './Page.tsx';
import Header, { Pages } from '../components/Header.tsx';
import useRefresh from '../utility/useRefresh.ts';
import axios from 'axios';
import { API_BASE_URL } from '../utility/constants.ts';
import { AppStateCtx } from '../App.tsx';
import ButtonWithPrompt from '../components/ButtonWithPrompt.tsx';
import OrderCard from '../components/orderCard.tsx';

import { ReactComponent as CloseIcon } from "../assets/close.svg"

import "./orderPage.css"
import { formatPrice } from '../utility/generic.ts';
import { useNavigate } from 'react-router-dom';

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
    const [orders,__] = useRefresh<any[]>(async () => {

        console.log("Refreshing Orders",appState.table);

        if(!appState.table){
            setError({error:true,
                errorTitle: "Dati tavolo mancanti",
                errorMessage: "Riprova a scansionare il qr, i dati potrebbero essersi persi"
            })
            return [];
        }

        return await axios.post(`${API_BASE_URL}/order/get_orders`, {
            data: {
                accessCode: appState.table.accessCode,
                sessionCode: appState.table.sessionCode,
            }
        }).then((res) => {
            const orders = res.data.data;
            console.log("Ordini",orders);

            //Sort order based on status
            return orders.sort((a,b) => {
                if (a.status === 'Done') {
                    return -1;
                }
                if (b.status === 'Done') {
                    return 1;
                }
                return a.time - b.time;
            })
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

    },[],20000);

    //Can request check only if there are more than 1 order and there aren't any not done Order
    const canRequestCheck = orders.length > 0 && orders.filter(o => o.status !== "Done").length === 0;

    //Function to request check
    const checkRequest = async () => {
        if(!canRequestCheck){
            return;
        }else{
            axios.post(`${backendUrl}/api/table/checkRequest`,{
                data:{
                    accessCode: appState.table.accessCode,
                    sessionCode: appState.table.sessionCode,
                }
            }).then((res) => {
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

    //Calculate total price
    const total = orders.flatMap(o => o.products)
                        .reduce((tot,prod) => (tot + prod.Price), 0);

    const checkText = canRequestCheck ? "Questa azione non può essere annullata, sei sicuro?" :
                    "Impossibile richiedere il conto, non hai ancora ricevuto tutti gli ordini";

    return (
        <Page error={error}>
            <Header pageName='Conto' current={Pages.Check}/>
            <section className='orders-container'>
                {orders.map((order,index) => <OrderCard key={order.documentId} order={order} index={index+1}/>)}
            </section>
            <Total total={total} className='total'/>
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

export function Total({total,discount,className}:{total:number,discount?:number,className?:string}){

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