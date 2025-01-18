import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import useRefresh from './utility/useRefresh.ts';

import ButtonWithPrompt from './components/popup/ButtonWithPrompt.tsx';
import Header, { Pages } from "./components/utility/Header.tsx"

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
import ErrorPage from './pages/ErrorPage.tsx';
import ContoPage from './pages/ContoPage.tsx';
import PizzaBuilder from './pages/PizzaBuilder.tsx';
import StrapiServerConnector from './server/backendServerConnector.ts';
import Server from './server/server.ts';
import CheckBox from './components/input/CheckBox.tsx';
import { toErrorPage } from './utility/generic.ts';

export const backendServer:Server = new StrapiServerConnector("http://localhost:1337");

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
    
    //eslint-disable-next-line 
    const [tableStatus,_] = useRefresh<string>(async () => {
        
        const url:string = window.location.pathname;

        //Stop if no table is selected
        if(!appState.table){
            
            //if(url !== "/error")
            //    window.location.replace('/error');
            
            return "";
        }
            
        //Fetch table status
        return await backendServer.table.fetchTableStatus(appState.table)
        .catch( e => {
            console.log(e);
            
            if(url !== "/error")
                window.location.replace('/error');

            return "";
        });

    },"",5000,[appState.table]);
    
    useEffect(() => {
        //When table Status change move to correct page
        const url:string = window.location.pathname;
        //console.log(tableStatus,url)
        if(tableStatus === "CHECK" && url !== "/check" ){
            window.location.replace('/check');
        }
        if(tableStatus === "EXPIRED" && url !== "/expired" ){
            window.location.replace('/expired');
        }
    },[tableStatus])

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
                        errorMessage='Sembra che la tua sessione di acquisto sia terminta, se ritieni sia un errore chiedi ad un cameriere'/>}/>
                    
                    <Route path='/error' element = {<ErrorPage></ErrorPage>}/>
                    <Route path='*' element={<ErrorPage errorTitle='Errore 404' retryBtn={false}
                        errorMessage='La pagina che cerchi non è disponibile'/>}/>
                </Routes>
            </BrowserRouter>
        </AppStateCtx.Provider>

    );
}

export default App;

//Test per vedere se funzionava
function Test() {

    const navigate = useNavigate();

    // eslint-disable-next-line
    const [state, setState] = useContext(AppStateCtx);

    const [time, refreshTime] = useRefresh<Date>(async () => new Date(), new Date(),1000);
    const [check, setCheck] = useState(false);

    const pad0 = (n:number,lenght:number):string => {
        let res:string = n.toString();
        return res.padStart(lenght,"0");
    }

    const formatDate = (date:Date):string => {

        const hours = pad0(date.getHours(),2);
        const mins = pad0(date.getMinutes(),2);
        const secs = pad0(date.getSeconds(),2);

        return hours + ":" + mins + ":" + secs;

    }

    const test = () => { alert("Ciao sono una azione irreversibile") }

    return (
        <Page>
            <Header pageName='Test' current={Pages.FC} />
            <h1 style={{ paddingTop: 100 }}>{formatDate(time)}</h1>

            <CheckBox text='Ciao' value ={check} onChange={(e) => {
                console.log("click")
                setCheck(c => !c)}}/>
            
            <button className="light-btn btn" onClick={refreshTime}> Che ore sono? </button>

            <ButtonWithPrompt className="dark-btn my-btn" onClick={test} popupTitle='Azione Irreversibile'
                popupText='Questa azione non può essere annullata, proseguire?'>
                <p style={{ margin: "0px" }}> Test Irreversibile </p>
            </ButtonWithPrompt>

            <button className='dark-btn-inverse my-btn' onClick={() => setState("table", { accessCode: "abcd", sessionCode: "3" })}>
                Log to table
            </button>
            <button className='err-btn my-btn' onClick={() => setState("table", { accessCode: "abcd", sessionCode: "4" })}>
                Log to expired table
            </button>

            <button className='err-btn my-btn' onClick={() => toErrorPage(navigate)}>
                Error
            </button>
            
        </Page>
    )
}