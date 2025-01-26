import { useState } from "react";

interface AppState { [key: string]: any };

export type AppStateHook = [AppState,(key:string,value:any) => void];

//Check if browser support storage 
//eslint-disable-next-line
const hasStorage = typeof (Storage) !== undefined;


/**
 * Custom hook to manage application state with optional persistent storage.
 *
 * @param {Storage} storage - The storage object to use for persisting state (e.g., localStorage or sessionStorage).
 * @returns {[AppState, (key: string, value: any) => void]} - Returns the current application state and a function to update the state.
 *
 * @typedef {Object} AppState - The type representing the application state.
 * @typedef {[AppState, (key: string, value: any) => void]} AppStateHook - The type representing the hook's return value.
 *
 * @example
 * const [appState, editState] = useAppState(localStorage);
 * 
 * // Update the state
 * editState('username', 'JohnDoe');
 * 
 * // Read State
 * console.log(appState.username) -> "JonhDoe"
 */
function useAppState(storage:Storage):AppStateHook{
    
    //Check storage to see if data where saved before 
    const loadAppState = () => {
        if (hasStorage) {
            const item = storage.getItem("appState");
            if (item) {
                return (JSON.parse(item));
            }
        }
        return {};
    }

    //Set state on load with saved data
    const [appState, setAppState] = useState<AppState>(loadAppState);

    //Updater function: updete [key] in state to be [value]
    const editState = (key: string, value: any): void => {

        setAppState(currState => {

            //Abort if no change appened (use a shallow check)
            if (currState[key] === value) {
                return currState;
            }

            const newState = { ...currState, [key]: value };

            //Store State in browser session storage
            if (hasStorage) {
                storage.setItem("appState", JSON.stringify(newState));
            }
            return newState;
        });
    }

    return [appState,editState];
}

export default useAppState;