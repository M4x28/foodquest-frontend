import React , {createContext, useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useRefresh from './utility/useRefresh.ts';


import Header, { Pages } from "./components/Header.tsx"

import './App.css';
import Popup from './components/Popup.tsx';
import ButtonWithPrompt from './components/ButtonWithPrompt.tsx';
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

    const test = () => { alert("Ciao sono una azione irreversibile")}

    return(
        <>
            <Header pageName='Test' current={Pages.FC}/>
            <h1 style={{paddingTop:100}}>{time && time.getTime()}</h1>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur voluptates ipsum quae neque obcaecati facere animi eos repellat, placeat ducimus saepe, corrupti qui laudantium cum ipsam esse consectetur voluptatum et.</h1>
            <button className = "dark-btn-inverse btn" onClick={refreshTime}> Che ore sono? </button>
            <ButtonWithPrompt onClick={test} popupTitle='Azione Irreversibile' 
                popupText='Questa azione non può essere annullata, proseguire?'>
                <h1> Test Irreversibile </h1>
            </ButtonWithPrompt>
        </>
    )
}