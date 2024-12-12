import React , {createContext, useState, useEffect,useContext} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

interface AppState{ [key:string] : any};
export const AppStateCtx = createContext<AppState>();

//Check if browser support storage
const hasStorage = typeof(Storage) !== undefined;

function App() {
    
    const [appState,setAppState] = useState<[AppState,Function]>({});

    //Check on mount if a previous state is been saved
    useEffect(() => {
        if(hasStorage){
            const item = sessionStorage.getItem("appState");
            if(item){
                setAppState(JSON.parse(item));      //Restore Saved State
            }
        }
    },[]);

    //Updater function: updete [paramName] in state to be [value]
    const editState = (paramName,value) => {
        
        setAppState(currState => {
            
            if(currState[paramName] === value){
                return currState;
            }

            console.log("edit");

            const newState = {...currState,[paramName] : value};

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
                    <Route path='/test' element={<Test></Test>}/>
                </Routes>
            </BrowserRouter>
        </AppStateCtx.Provider>
    );
}

export default App;

function Test(){
    const [state,edit] = useContext(AppStateCtx);

    return(
        <>
            <p> {state.time || 0 }</p>
            <button onClick = {() => edit("time",new Date().getTime())} > HEY </button>
        </>
    )
}