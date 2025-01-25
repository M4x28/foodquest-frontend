import { useState, useEffect } from 'react';

/**
 * Custom hook per gestire il refresh automatico o manuale di un valore.
 * 
 * @template T - Tipo del valore da gestire.
 * @param {(old: T) => T | Promise<T>} refresh - Funzione per aggiornare il valore, può essere sincrona o asincrona.
 * @param {T} defaultValue - Valore iniziale di default.
 * @param {number} [time] - (Opzionale) Intervallo di tempo in millisecondi per il refresh automatico.
 * @param {any[]} [dependencies] - (Opzionale) Dipendenze che triggerano il refresh automatico.
 * @returns {[T, () => void]} Un array contenente il valore corrente e una funzione per forzare manualmente il refresh.
 */
function useRefresh<T>(
    refresh: ((old: T) => T) | ((old: T) => Promise<T>),
    defaultValue: T,
    time?: number,
    dependencies: any[] = []
): [T, () => void] {

    const [value, setValue] = useState<T>(defaultValue);

    //Handle refresh callback, use asyinc to handle both sync and async call
    const refreshCallback = async () => {
        let newVal = await refresh(value);
        setValue(newVal);
    };

    useEffect(() => {
        // Execute first load of value on mount
        refreshCallback();

        // If time was specified begin the period update cicle
        if (time) {
            const intervalID = setInterval(refreshCallback, time);
            return () => clearInterval(intervalID); // Clear interval on unmount
        }
    }, dependencies);

    return [value, refreshCallback];
}

export default useRefresh;