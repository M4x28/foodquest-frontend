import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppStateCtx, backendServer } from '../App.tsx';
import OrderCard from '../components/card/orderCard.tsx';
import ButtonWithPrompt from '../components/popup/ButtonWithPrompt.tsx';
import Header, { Pages } from '../components/utility/Header.tsx';
import Total from '../components/utility/Total.tsx';
import { Order } from '../server/server.ts';
import useRefresh from '../utility/useRefresh.ts';

import { ReactComponent as CloseIcon } from "../assets/close.svg";
import CheckBox from '../components/input/CheckBox.tsx';
import LoadingPopup from '../components/popup/LoadingPopup.tsx';
import { toErrorPage } from '../utility/generic.ts';
import useLoading from '../utility/useLoading.ts';
import "./contoPage.css";

/**
 * Componente per la pagina del conto, che consente di visualizzare gli ordini,
 * applicare punti fedeltà e richiedere il conto.
 */
function ContoPage() {
    const navigate = useNavigate();

    // eslint-disable-next-line
    const [appState, _] = useContext(AppStateCtx);

    // State for handling fc point usage
    const [usingPoint, setUsingPoint] = useState(false);
    const [point, setPoint] = useState(0);

    //Loader states
    const [loadingOrders, startLoadOrders, endLoadOrders] = useLoading(1000, true);
    const [loadingTotal, startLoadTotal, endLoadTotal] = useLoading(1000, true);

    // Fecth user detail for handling fc card
    useEffect(() => {
        if (appState.user) {
            const fetchUserData = async () => {
                try {
                    const userFC = await backendServer.fc.fetchUserFC(appState.user.user.documentId);
                    setUsingPoint(userFC.UsePoints !== null ? userFC.UsePoints : false);
                    setPoint(userFC.Points);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    toErrorPage(navigate);
                }
            };
            fetchUserData();
        }
    }, [appState.user]); //Dependecy Should not change while on this page, but better safe than sorry

    // Periodically fetch orders done (20s)
    // eslint-disable-next-line
    const [orders, __] = useRefresh<Order[]>(async () => {

        //Go to error page if table is not specified
        if (!appState.table) {
            toErrorPage(navigate);
            return [];
        }

        //Fetch order from backend server
        const orders = await backendServer.orders.fetchOrdersDone(appState.table)
            .catch((err) => {
                console.log(err);
                toErrorPage(navigate);
                return [];
            });

        endLoadOrders();
        return orders;

    }, [], 20000);

    // Periodically fetch total (20s)
    // Separate from order to allow separate refresh when needed (Point usage change)
    // eslint-disable-next-line
    const [{ total, discount }, reloadTotal] = useRefresh<{ total: number, discount: number }>(async () => {

        //Go to error page if table is not specified
        if (!appState.table) {
            toErrorPage(navigate);
            return { total: 0, discount: 0 };
        }

        //Fetch total from backend server
        const total = await backendServer.table.fetchTotal(appState.table)
            .catch((err) => {
                console.log(err);
                toErrorPage(navigate);
                return { total: 0, discount: 0 };
            });

        endLoadTotal();
        return total;

    }, { total: 0, discount: 0 }, 20000, [appState.table]);

    //See if is possible to request check (Must be at least one order and all must be completed)
    const canRequestCheck = orders && orders.length > 0 && orders.filter(o => o.status !== "Done").length === 0;

    //Ask for check
    const checkRequest = async () => {
        if (!canRequestCheck) {
            //Abort if not possible
            return;
        } else {
            backendServer.table.askForCheck(appState.table)
                .then(() => {
                    console.log("Richiesta conto effettuata");
                    navigate("/check");     //Redirect to check page on success
                }).catch((err) => {
                    console.log(err);
                    toErrorPage(navigate);
                    return [];
                });
        }
    };

    //Change if the user is using is point for discount
    const handlePointUsageChange = () => {
        const newUsePoint = !usingPoint;
        backendServer.fc.setPointUsage(appState.user.user.documentId, newUsePoint)
            .then(() => {
                setUsingPoint(newUsePoint)  //Setting state only after success
                reloadTotal();              //Reload the total
            })
            .catch(e => {
                console.log(e);
                toErrorPage(navigate);
            });
    };

    // Popup text for check request based on if can be done
    const checkText = canRequestCheck
        ? "Questa azione non può essere annullata, sei sicuro?"
        : "Impossibile richiedere il conto, non hai ancora ricevuto tutti gli ordini";

    return (
        <div className='page'>
            <Header pageName='Conto' current={Pages.Check} />

            <section className='orders-container' style={{
                height: '650px',
            }}>
                {!loadingOrders && (orders.length > 0 ?
                    orders.map((order, index) => (
                        <OrderCard key={order.documentId} order={order} index={index + 1} />
                    )) :
                    <h3 className='total'> Nessun ordine trovato </h3>
                )}
            </section>

            {(appState.user && point > 0) &&
                <CheckBox
                    value={usingPoint}
                    text={"Usa i tuoi " + point + " punti"}
                    className='toggle-point'
                    onChange={handlePointUsageChange}
                />
            }

            <Total total={total} discount={discount} className='total' />

            <ButtonWithPrompt
                onClick={checkRequest}
                className='check-btn'
                popupTitle='Chiedi il conto'
                popupText={checkText}
                confirmVariant={canRequestCheck ? "success" : "danger"}
                confirmText={canRequestCheck ? undefined : "CHIUDI"}
                confirmClass={canRequestCheck ? undefined : 'err-btn confirm-btn'}
                confirmSvg={canRequestCheck ? undefined : <CloseIcon />}
            >
                Chiedi il conto
            </ButtonWithPrompt>
            <LoadingPopup loading={loadingOrders || loadingTotal}></LoadingPopup>
        </div>
    );
}

export default ContoPage;