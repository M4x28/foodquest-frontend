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

    /**
     * Funzione per eseguire il refresh del valore.
     * Gestisce sia chiamate sincrone che asincrone utilizzando `await`.
     */
    const refreshCallback = async () => {
        let newVal = await refresh(value); // Esegue la funzione di refresh sul valore corrente
        setValue(newVal); // Aggiorna lo stato con il nuovo valore
    };

    useEffect(() => {
        // Esegue un refresh iniziale quando il componente è montato
        refreshCallback();

        // Se è specificato un intervallo di tempo, avvia un refresh automatico periodico
        if (time) {
            const intervalID = setInterval(refreshCallback, time); // Imposta l'intervallo di aggiornamento
            return () => clearInterval(intervalID); // Cancella l'intervallo quando il componente viene smontato
        }
    }, dependencies); // Il refresh automatico è legato alle dipendenze specificate

    // Restituisce il valore corrente e una funzione per forzare manualmente il refresh
    return [value, refreshCallback];
}

export default useRefresh;