import React, { useContext, useState } from 'react';
import Page, { Error } from './Page.tsx';
import Header, { Pages } from '../components/Header.tsx';
import useRefresh from '../utility/useRefresh.ts';
import axios from 'axios';
import { backendUrl } from '../utility/constants.ts';
import { AppStateCtx } from '../App.tsx';
import ButtonWithPrompt from '../components/ButtonWithPrompt.tsx';
import OrderCard from '../components/orderCard.tsx';

import { ReactComponent as CloseIcon } from "../assets/close.svg"

import "./orderPage.css"
import { formatPrice } from '../utility/generic.ts';

export interface Order {
    documentId: string,
    status: string,
    time: number,
    products: any[];
}

function ContoPage() {

    // eslint-disable-next-line
    const [appState, _] = useContext(AppStateCtx);

    const [error, setError] = useState<Error>({ error: false });

    //Fetch table order periodicalliy
    // eslint-disable-next-line
    const [orders, __] = useRefresh<any[]>(async () => {

        console.log("Refreshing Orders", appState.table);

        if (!appState.table) {
            setError({
                error: true,
                errorTitle: "Dati tavolo mancanti",
                errorMessage: "Riprova a scansionare il qr, i dati potrebbero essersi persi"
            })
            return [];
        }

        return await axios.post(`${backendUrl}/api/order/get_orders`, {
            data: {
                accessCode: appState.table.accessCode,
                sessionCode: appState.table.sessionCode,
            }
        }).then((res) => {
            const orders = res.data;
            console.log("Ordini", orders);

            //Sort order based on status
            return orders.sort((a, b) => {
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
            setError({
                error: false,
                errorTitle: "Connessione al server fallita",
                errorMessage: "Controlla la tua connessione a internet e riprova"
            })
            return [];
        })

    }, [], 20000);

    //Can request check only if there are more than 1 order and there aren't any not done Order
    const canRequestCheck = orders.length > 0 && orders.filter(o => o.status !== "Done").length === 0;

    //Function to request check
    const checkRequest = async () => {
        if (!canRequestCheck) {
            return;
        } else {
            axios.post(`${backendUrl}/api/table/checkRequest`, {
                data: {
                    accessCode: appState.table.accessCode,
                    sessionCode: appState.table.sessionCode,
                }
            }).then((res) => {
                console.log("Richiesta conto effettuata");
            }).catch((err) => {
                console.log(err);
                setError({
                    error: false,
                    errorTitle: "Connessione al server fallita",
                    errorMessage: "Controlla la tua connessione a internet e riprova"
                })
                return [];
            })
        }
    };

    //Calculate total price
    const total = orders.flatMap(o => o.products)
        .reduce((tot, prod) => (tot + prod.Price), 0);

    const checkText = canRequestCheck ? "Questa azione non può essere annullata, sei sicuro?" :
        "Impossibile richiedere il conto, non hai ancora ricevuto tutti gli ordini";

    return (
        <Page error={error}>
            <Header pageName='Conto' current={Pages.Check} />
            <section className='orders-container'>
                {orders.map((order, index) => <OrderCard key={order.documentId} order={order} index={index + 1} />)}
            </section>
            <p className='total'><strong className='font-weight-bold'>Totale</strong>: {formatPrice(total)}€</p>
            <ButtonWithPrompt onClick={checkRequest} className='dark-btn check-btn'
                popupTitle='Chiedi il conto' popupText={checkText}
                confirmText={canRequestCheck ? undefined : "CHIUDI"} confirmClass={canRequestCheck ? undefined : 'err-btn confirm-btn'}
                confirmSvg={canRequestCheck ? undefined : <CloseIcon />}>
                Chiedi il conto
            </ButtonWithPrompt>
        </Page>
    );
}

export default ContoPage;