import { useEffect, useRef, useState } from "react";

//Hook to save loading state, you can add a delay to the load to avoid showing on load too short
function useLoading(defaultMinTime:number = 500,init:boolean = true):[boolean,(time?:number) => void,() => void]{

    const [loading,setLoading] = useState(false);       //Is loading
    const timeout = useRef<NodeJS.Timeout>(undefined);  //Timeout used for delayed load

    //Utility: if exist clear the timeout
    const clearTimeout = () => {
        if(timeout.current){
            clearInterval(timeout.current);
            timeout.current = undefined;
        }
    }

    //Start the loading sequence
    const startLoad = (minTime?:number):void => {
        //Ovveride time to display if specified
        const time = minTime ? minTime : defaultMinTime;

        //If the timeout is going clear it
        clearTimeout();

        //Start the timeout
        timeout.current = setTimeout( () => setLoading(true), time);
    }

    //Clear timeout and reset loading
    const finishLoad = () => {
        clearTimeout();
        setLoading(false);
    }

    useEffect(() => {
        
        //Start loading sequence if specified
        if(init)
            startLoad();

        //Clear eventual timeout on unmount
        return clearTimeout;    
    },[]);

    return [loading,startLoad,finishLoad];
}

export default useLoading;