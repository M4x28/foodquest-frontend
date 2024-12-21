import React , {createContext, useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useRefresh from './utility/useRefresh.ts';

import ButtonWithPrompt from './components/ButtonWithPrompt.tsx';
import Header, { Pages } from "./components/Header.tsx"

import './App.css';
import Page from './pages/Page.tsx';

interface AppState{ [key:string] : any};

export const AppStateCtx = createContext<[AppState,Function]>([{}, () => 0]);

//Check if browser support storage
const hasStorage = typeof(Storage) !== undefined;

function App() {
    
    const [appState,setAppState] = useState<AppState>({});

    //Check on mount if a previous state is been saved
    useEffect(() => {
        if(hasStorage){
            const item = sessionStorage.getItem("appState");
            if(item){
                setAppState(JSON.parse(item));      //Restore Saved State
            }
        }
    },[]);

    //Updater function: updete [key] in state to be [value]
    const editState = (key:string, value:any):void => {
        
        setAppState(currState => {
            
            if(currState[key] === value){
                return currState;
            }

            console.log("edit");

            const newState = {...currState,[key] : value};

            //Store State in browser session storage
            if(hasStorage){
                sessionStorage.setItem("appState",JSON.stringify(newState));
            }

            return newState;
        });
    }
    
    return (
        <AppStateCtx.Provider value={[appState,editState]}>
            <BrowserRouter>
                <Routes>
                    <Route path='/test' element={<Test></Test>}/>   {/*Test per vedere se funzionava*/}
                </Routes>
            </BrowserRouter>
        </AppStateCtx.Provider>
    );
}

export default App;

//Test per vedere se funzionava
function Test(){
    
    const [time,refreshTime] = useRefresh<Date>(async () => new Date(),new Date());
    const [err,setErr] = useState(false)

    const test = () => { alert("Ciao sono una azione irreversibile")};

    const eT = 'Qualcosa non è andato storto';
    const eM = 'Dato che hai cliccato un tasto di errore se questa pagina non ci fosse allora qualcosa sarebbe andato storto';

    return(
        <Page error = {err} errorTitle={eT} errorMessage= {eM}>
            <Header pageName='Test' current={Pages.FC}/>
            <h1>{time && time.getTime()}</h1>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur voluptates ipsum quae neque obcaecati facere animi eos repellat, placeat ducimus saepe, corrupti qui laudantium cum ipsam esse consectetur voluptatum et.</h1>
            <button className = "light-btn btn" onClick={refreshTime}> Che ore sono? </button>
            <ButtonWithPrompt className = "dark-btn btn" onClick={test} popupTitle='Azione Irreversibile' 
                popupText='Questa azione non può essere annullata, proseguire?'>
                <p style={{margin: "0px"}}> Test Irreversibile </p>
            </ButtonWithPrompt>
            <button className='err-btn btn' onClick={() => setErr(true)}>
                Errore
            </button>
        </Page>
    )
}