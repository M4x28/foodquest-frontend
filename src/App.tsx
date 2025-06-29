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
import SelectionPage from './pages/SelectionPage.tsx';
import RegisterPage from './pages/registrazione.tsx';
import StrapiServerConnector from './server/backendServerConnector.ts';
import Server from './server/server.ts';
import Landing from './pages/landing.tsx';
import Test from './Test.tsx';
import { toErrorPage } from './utility/generic.ts';
import useAppState, { AppStateHook } from './utility/useAppState.ts';

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
                <Route path='/allergeni' element={<SelectionPage
                    title='Seleziona eventuali allergeni e/o intolleranze'
                    skipEnabled={false}
                    minSelected={0}
                    maxSelected={3}
                    onContinue={(selectedIds) => {
                        console.log('Selected allergens:', selectedIds);
                    }}
                />} />
                <Route path='/pizze-preferite' element={<SelectionPage
                    title='Seleziona le tue Pizze Classiche Preferite'
                    skipEnabled={false}
                    minSelected={1}
                    maxSelected={3}
                    items={[
                        { id: 'margherita', label: 'Margherita' },
                        { id: 'cotto-funghi', label: 'Cotto e Funghi' },
                        { id: '4-formaggi', label: '4 Formaggi' },
                        { id: 'capricciosa', label: 'Capricciosa' },
                        { id: 'diavola', label: 'Diavola' },
                        { id: 'vegetariana', label: 'Vegetariana' },
                        { id: 'fume', label: 'Fumè' },
                        { id: 'bufala', label: 'Bufala' },
                        { id: 'wruste-patatine', label: 'Wruste e Patatine' },
                        { id: 'crudo-panna', label: 'Crudo e Panna' },
                        { id: 'crudo-stracciatella', label: 'Crudo e Stracciatella' },
                        { id: 'crudaiola', label: 'Crudaiola' },
                        { id: 'cocktail', label: 'Cocktail' },
                        { id: 'tonno-cipolla', label: 'Tonno e Cipolla' },
                        { id: 'capocollo-burrata', label: 'Capocollo e Burrata' },
                        { id: 'marinara', label: 'Marinara' },
                        { id: 'romana', label: 'Romana' },
                        { id: 'salsiccia-funghi', label: 'Salsiccia e Funghi' },
                    ]}
                    onContinue={(selectedIds) => {
                        console.log('Pizze classiche preferite:', selectedIds);
                    }}
                    onSkip={() => {
                        console.log('Skipped pizza selection');
                    }}
                />} />
                <Route path='/specifiche' element={<SelectionPage
                    title='Seleziona eventuali Specifiche Nutrizionali'
                    skipEnabled={true}
                    minSelected={0}
                    maxSelected={3}
                    items={[
                        { id: '1', label: 'Alto contenuto proteico' },
                        { id: '2', label: 'Vegano' },
                        { id: '3', label: 'Vegetariano' },
                        { id: '4', label: 'Basso contenuto di grassi' },
                        { id: '5', label: 'Basso contenuto di carboidrati' },
                        { id: '6', label: 'Basso contenuto calorico' },
                        { id: '7', label: 'Facilmente digeribile' },
                        { id: '8', label: 'Basso contenuto di colesterolo' },
                    ]}
                    onContinue={(selectedIds) => {
                        console.log('Specifiche nutrizionali selezionate:', selectedIds);
                    }}
                    onSkip={() => {
                        console.log('Skipped specifiche nutrizionali');
                    }}
                />} />
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