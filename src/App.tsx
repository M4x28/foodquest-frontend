import React , {createContext, useState, useEffect,useContext} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Header, { Pages } from "./components/Header.tsx"
import Popup from './components/Popup.tsx';
import ButtonWithPrompt from './components/ButtonWithPrompt.tsx';

interface AppState{ [key:string] : any};
export const AppStateCtx = createContext<[AppState,Function]>();

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
    const [state,edit] = useContext(AppStateCtx);
    const [popUp,setpopUp] = useState(false);

    const test = () => {
        alert("Ciao io sono un azione non reversibile");
    }

    return(
        <>
            <Header pageName='TEST' current={Pages.Check}/>
            <p style={{paddingTop:100}}> {state.time || 0 }</p>
            <button onClick = {() => edit("time",new Date().getTime())} > HEY </button><br></br>
            <button onClick = {() => setpopUp(true)}>Hey</button>
            <ButtonWithPrompt onClick={test} className='dark-btn-inverse btn'
                popupTitle='Test' popupText='Questa azione non è reversibile, continuare?'>
                Test
            </ButtonWithPrompt>
            <p style={{fontSize:"50px"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio dolor, id, quae velit voluptas tempore perferendis eveniet sint ullam ratione ea, reprehenderit sit rerum perspiciatis facilis voluptatibus sunt facere libero!</p>
            <p style={{fontSize:"50px"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio dolor, id, quae velit voluptas tempore perferendis eveniet sint ullam ratione ea, reprehenderit sit rerum perspiciatis facilis voluptatibus sunt facere libero!</p>
            <Popup open={popUp} close={() => setpopUp(false)}>
                <h1> Lorem </h1>
                <h3> Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis consequatur, beatae nemo, magni dignissimos molestias dolore id, doloribus vitae omnis libero commodi nihil aperiam? Nulla laborum quas vel aliquam doloremque! </h3>
            </Popup>
        </>
    )
}