import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useRefresh from './utility/useRefresh.ts';

import Account from './pages/account.tsx';
import CheckPage from './pages/CheckPage.tsx';
import ContoPage from './pages/ContoPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Home from './pages/home.tsx';
import Login from './pages/login.tsx';
import OrderPage from './pages/OrderPage.tsx';
import PizzaBuilder from './pages/PizzaBuilder.tsx';
import ProductPage from './pages/ProductPage.tsx';
import RegisterPage from './pages/registrazione.tsx';
import StrapiServerConnector from './server/backendServerConnector.ts';
import Server from './server/server.ts';
import Landing from './pages/landing.tsx';
import Test from './Test.tsx';
import { toErrorPage } from './utility/generic.ts';
import useAppState,{ AppStateHook } from './utility/useAppState.ts';

import './App.css';

export const backendServer: Server = new StrapiServerConnector(process.env.REACT_APP_API_URL);

export const AppStateCtx = createContext<AppStateHook>([{}, () => { }]);

function App() {

    const navigate = useNavigate();

    const [appState, editAppState] = useAppState(sessionStorage);

    const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const resetInactivityTimeout = () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
            inactivityTimeout.current = setTimeout(() => {
                handleLogout();
            }, 30 * 60 * 1000); // 30 minuti in millisecondi
        };

        const handleLogout = () => {
            editAppState("user", undefined);
            window.location.href = "/login"; // Reindirizza alla pagina di login
        };

        const events = ["mousemove", "keydown", "click"];
        events.forEach(event => window.addEventListener(event, resetInactivityTimeout));

        resetInactivityTimeout();

        return () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
            events.forEach(event => window.removeEventListener(event, resetInactivityTimeout));
        };
    }, [editAppState]);

    //Periodically Fetch table status
    //eslint-disable-next-line 
    const [tableStatus, _] = useRefresh<string>(async () => {

        //Stop if no table is selected
        if (!appState.table) {
            return "";
        }

        //Fetch table status
        return await backendServer.table.fetchTableStatus(appState.table)
            .catch(e => {
                console.log(e);

                toErrorPage(navigate);

                return "";
            });

    }, "", 5000, [appState.table]);

    //When table Status change move to correct page
    useEffect(() => {

        console.log(tableStatus);
        if (tableStatus === "CHECK") {
            navigate("/check")
        }
        if (tableStatus === "EXPIRED") {
            navigate('/expired');
        }
    }, [tableStatus])

    return (
        <AppStateCtx.Provider value={[appState, editAppState]}>

            <Routes>
                <Route index element={<Landing />} />
                <Route path="/products/:categoryID" element={<ProductPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path='/creazionepizza/:productID?' element={<PizzaBuilder></PizzaBuilder>} />
                <Route path='/home' element={<Home></Home>} />
                <Route path='/login' element={<Login></Login>} />
                <Route path='/register' element={<RegisterPage></RegisterPage>} />
                <Route path='/order' element={<OrderPage></OrderPage>} />
                <Route path='/conto' element={<ContoPage></ContoPage>} />
                <Route path='/account' element={<Account></Account>} />
                <Route path='/test' element={<Test></Test>} />
                <Route path='/check' element={<CheckPage />} />
                <Route path='/expired' element={<ErrorPage errorTitle='Sessione Scaduta' retryBtn={false}
                    errorMessage='Sembra che la tua sessione di acquisto sia terminta, se ritieni sia un errore chiedi ad un cameriere' />}
                />

                <Route path='/error' element={<ErrorPage></ErrorPage>} />
                <Route path='*' element={<ErrorPage errorTitle='Errore 404' retryBtn={false}
                    errorMessage='La pagina che cerchi non è disponibile' />}
                />
            </Routes>

        </AppStateCtx.Provider>

    );
}

export default App;