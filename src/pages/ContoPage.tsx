import React, { useContext, useEffect, useState } from 'react';
import Page from './Page.tsx';
import Header, { Pages } from '../components/utility/Header.tsx';
import useRefresh from '../utility/useRefresh.ts';
import { AppStateCtx } from '../App.tsx';
import ButtonWithPrompt from '../components/popup/ButtonWithPrompt.tsx';
import OrderCard from '../components/card/orderCard.tsx';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../App.tsx';
import { Order } from '../server/server.ts';
import Total from '../components/utility/Total.tsx';

import { ReactComponent as CloseIcon } from "../assets/close.svg";
import "./contoPage.css";
import CheckBox from '../components/input/CheckBox.tsx';
import { toErrorPage } from '../utility/generic.ts';

/**
 * Componente per la pagina del conto, che consente di visualizzare gli ordini,
 * applicare punti fedeltà e richiedere il conto.
 */
function ContoPage() {
    const navigate = useNavigate(); // Hook per la navigazione

    // Recupera lo stato globale dell'applicazione
    // eslint-disable-next-line
    const [appState, _] = useContext(AppStateCtx);

    // Stato per i punti fedeltà e il loro utilizzo
    const [usingPoint, setUsingPoint] = useState(false); // Flag per l'uso dei punti
    const [point, setPoint] = useState(0); // Numero di punti disponibili

    // Effettua il fetch dei dati dell'utente quando lo stato dell'utente cambia
    useEffect(() => {
        if (appState.user) {
            const fetchUserData = async () => {
                try {
                    const userFC = await backendServer.fc.fetchUserFC(appState.user.user.documentId);
                    setUsingPoint(userFC.UsePoints !== null ? userFC.UsePoints : false); // Imposta lo stato dei punti
                    setPoint(userFC.Points); // Imposta il numero di punti
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    toErrorPage(navigate); // Reindirizza alla pagina di errore in caso di errore
                }
            };
            fetchUserData();
        }
    }, [appState.user]); // Dipendenza: aggiorna quando cambia l'utente

    // Usa il custom hook `useRefresh` per aggiornare periodicamente gli ordini associati al tavolo
    // eslint-disable-next-line
    const [orders, __] = useRefresh<Order[]>(async () => {
        if (!appState.table) {
            toErrorPage(navigate); // Reindirizza alla pagina di errore se il tavolo non è valido
            return [];
        }

        return await backendServer.orders.fetchOrdersDone(appState.table)
            .catch((err) => {
                console.log(err); // Logga eventuali errori
                toErrorPage(navigate); // Reindirizza alla pagina di errore
                return [];
            });

    }, [], 20000); // Aggiorna ogni 20 secondi

    // Usa `useRefresh` per aggiornare periodicamente il totale e lo sconto
    // eslint-disable-next-line
    const [{ total, discount }, reloadTotal] = useRefresh<{ total: number, discount: number }>(async () => {
        if (!appState.table) {
            toErrorPage(navigate); // Reindirizza alla pagina di errore se il tavolo non è valido
            return { total: 0, discount: 0 };
        }

        return await backendServer.table.fetchTotal(appState.table); // Recupera totale e sconto
    }, { total: 0, discount: 0 }, 20000, [appState.table]); // Aggiorna ogni 20 secondi

    // Determina se è possibile richiedere il conto
    const canRequestCheck = orders.length > 0 && orders.filter(o => o.status !== "Done").length === 0;

    /**
     * Richiede il conto se le condizioni lo permettono.
     */
    const checkRequest = async () => {
        if (!canRequestCheck) {
            return; // Esci se non è possibile richiedere il conto
        } else {
            backendServer.table.askForCheck(appState.table)
                .then(() => {
                    console.log("Richiesta conto effettuata");
                    navigate("/check"); // Naviga alla pagina di conferma richiesta conto
                }).catch((err) => {
                    console.log(err); // Logga eventuali errori
                    toErrorPage(navigate); // Reindirizza alla pagina di errore
                    return [];
                });
        }
    };

    /**
     * Gestisce il cambiamento dello stato di utilizzo dei punti fedeltà.
     */
    const handlePointUsageChange = () => {
        const newUsePoint = !usingPoint; // Inverte lo stato di utilizzo dei punti
        backendServer.fc.setPointUsage(appState.user.user.documentId, newUsePoint)
            .then(() => {
                setUsingPoint(newUsePoint); // Aggiorna lo stato locale
                reloadTotal(); // Ricarica il totale e lo sconto
            })
            .catch(e => {
                console.log(e); // Logga eventuali errori
                toErrorPage(navigate); // Reindirizza alla pagina di errore
            });
    };

    // Testo del popup di conferma per la richiesta del conto
    const checkText = canRequestCheck
        ? "Questa azione non può essere annullata, sei sicuro?"
        : "Impossibile richiedere il conto, non hai ancora ricevuto tutti gli ordini";

    return (
        <Page>
            {/* Intestazione della pagina */}
            <Header pageName='Conto' current={Pages.Check} />

            {/* Sezione per visualizzare gli ordini */}
            <section className='orders-container mt-4'>
                {orders.map((order, index) => (
                    <OrderCard key={order.documentId} order={order} index={index + 1} />
                ))}
            </section>

            {/* CheckBox per l'utilizzo dei punti fedeltà */}
            {appState.user &&
                <CheckBox
                    value={usingPoint}
                    text={"Usa i tuoi " + point + " punti"}
                    className='toggle-point'
                    onChange={handlePointUsageChange}
                />
            }

            {/* Totale e sconto */}
            <Total total={total} discount={discount} className='total' />

            {/* Bottone per richiedere il conto con prompt di conferma */}
            <ButtonWithPrompt
                onClick={checkRequest}
                className='check-btn'
                popupTitle='Chiedi il conto'
                popupText={checkText}
                confirmText={canRequestCheck ? undefined : "CHIUDI"}
                confirmClass={canRequestCheck ? undefined : 'err-btn confirm-btn'}
                confirmSvg={canRequestCheck ? undefined : <CloseIcon />}
            >
                Chiedi il conto
            </ButtonWithPrompt>
        </Page>
    );
}

export default ContoPage;