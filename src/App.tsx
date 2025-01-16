import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import useRefresh from './utility/useRefresh.ts';

import ButtonWithPrompt from './components/ButtonWithPrompt.tsx';
import Header, { Pages } from "./components/Header.tsx"

import './App.css';
import Page, { Error } from './pages/Page.tsx';
import ProductPage from './pages/ProductPage.tsx';
import OrderPage from './pages/OrderPage.tsx';
import LandingPage from './pages/landingpage.tsx';
import Home from './pages/home.tsx';
import Login from './pages/login.tsx';
import RegisterPage from './pages/registrazione.tsx';
import Account from './pages/account.tsx';
import CheckPage from './pages/CheckPage.tsx';
import axios from 'axios';
import { API_BASE_URL } from './utility/constants.ts';
import ErrorPage from './pages/ErrorPage.tsx';
import ContoPage from './pages/ContoPage.tsx';
import PizzaBuilder from './pages/PizzaBuilder.tsx';

interface AppState { [key: string]: any };

export const AppStateCtx = createContext<[AppState, Function]>([{}, () => 0]);

//Check if browser support storage 
//eslint-disable-next-line
const hasStorage = typeof (Storage) !== undefined;

const loadAppState = () => {
    if (hasStorage) {
        const item = sessionStorage.getItem("appState");
        if (item) {
            return (JSON.parse(item));
        }
    }
    return {};
}
function App() {

    const [appState, setAppState] = useState<AppState>(loadAppState);

    //Periodacally check table status
    useEffect(() => {
        const intervalID = setInterval(
            () => {
                if (!appState.table)
                    return;

                axios.post(`${API_BASE_URL}/table/status`, {
                    data: {
                        accessCode: appState.table.accessCode,
                        sessionCode: appState.table.sessionCode,
                    }
                }).then((res) => {
                    //Navigate to coorect page based on the status
                    const status: string = res.data;
                    const url: string = window.location.pathname;
                    console.log(status, url)
                    if (status === "CHECK" && url !== "/check") {
                        window.location.replace('/check');
                    }
                    if (status === "EXPIRED" && url !== "/expired") {
                        window.location.replace('/expired');
                    }
                })
            }, 5000)

        return () => clearInterval(intervalID);
    }, [])

    //Updater function: updete [key] in state to be [value]
    const editState = (key: string, value: any): void => {

        setAppState(currState => {

            if (currState[key] === value) {
                return currState;
            }

            const newState = { ...currState, [key]: value };

            //Store State in browser session storage
            if (hasStorage) {
                sessionStorage.setItem("appState", JSON.stringify(newState));
            }
            return newState;
        });
    }

    return (
        <AppStateCtx.Provider value={[appState, editState]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/products/:categoryID" element={<ProductPage />} />
                    <Route path="/orders" element={<OrderPage />} />
                    <Route path='/creazionepizza' element={<PizzaBuilder></PizzaBuilder>} />
                    <Route path='/landingpage' element={<LandingPage></LandingPage>} />
                    <Route path='/home' element={<Home></Home>} />
                    <Route path='/login' element={<Login></Login>} />
                    <Route path='/register' element={<RegisterPage></RegisterPage>} />
                    <Route path='/order' element={<OrderPage></OrderPage>} />
                    <Route path='/conto' element={<ContoPage></ContoPage>} />
                    <Route path='/account' element={<Account></Account>} />
                    <Route path='/test' element={<Test></Test>} />
                    <Route path='/check' element={<CheckPage />} />
                    <Route path='/expired' element={<ErrorPage errorTitle='Sessione Scaduta' retryBtn={false}
                        errorMessage='Sembra che la tua sessione di acquisto sia terminta, se ritieni sia un errore chiedi ad un cameriere' />} />
                </Routes>
            </BrowserRouter>
        </AppStateCtx.Provider>

    );
}

export default App;

//Test per vedere se funzionava
function Test() {

    const [err, setErr] = useState(false);
    // eslint-disable-next-line
    const [state, setState] = useContext(AppStateCtx);

    const [time, refreshTime] = useRefresh<Date>(async () => new Date(), new Date());

    const test = () => { alert("Ciao sono una azione irreversibile") }

    const error: Error = {
        error: err,
        errorTitle: 'Qualcosa non è andato storto',
        errorMessage: 'Dato che hai cliccato un tasto di errore se questa pagina non ci fosse allora qualcosa sarebbe andato storto'
    }

    return (
        <Page error={error}>
            <Header pageName='Test' current={Pages.NULL} />
            <h1 style={{ paddingTop: 100 }}>{time && time.getTime()}</h1>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur voluptates ipsum quae neque obcaecati facere animi eos repellat, placeat ducimus saepe, corrupti qui laudantium cum ipsam esse consectetur voluptatum et.</h1>
            <button className="light-btn btn" onClick={refreshTime}> Che ore sono? </button>
            <ButtonWithPrompt className="dark-btn my-btn" onClick={test} popupTitle='Azione Irreversibile'
                popupText='Questa azione non può essere annullata, proseguire?'>
                <p style={{ margin: "0px" }}> Test Irreversibile </p>
            </ButtonWithPrompt>
            <button className='err-btn my-btn' onClick={() => setErr(true)}>
                Errore
            </button>
            <button className='dark-btn-inverse my-btn' onClick={() => setState("table", { accessCode: "abcd", sessionCode: "3" })}>
                Log to table
            </button>
            <button className='err-btn my-btn' onClick={() => setState("table", { accessCode: "abcd", sessionCode: "4" })}>
                Log to expired table
            </button>
        </Page>
    )
}