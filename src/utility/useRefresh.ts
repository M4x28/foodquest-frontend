import {useState, useEffect} from 'react';

function useRefresh<T>( refresh:(() => T) | (() => Promise<T>), defaultValue:T,time?: number, ) : [T,() => void] {

    //State containig the value
    const [value,setValue] = useState<T>(defaultValue);

    //Function that perform the refresh, using await let me handle both sincronus and async call
    const refreshCallback = async () => {
        let newVal = await refresh();
        setValue(newVal);
    }

    useEffect(() => {
        //Start with a refresh at time 0
        refreshCallback();

        //If auto refresh time if specified start interval
        if(time){
            const intervalID = setInterval( refreshCallback, time);
            return () => clearInterval(intervalID);
        }
    } ,[]);

    return [value,refreshCallback];
}

export default useRefresh;