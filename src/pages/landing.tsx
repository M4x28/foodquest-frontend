import React, { useContext, useEffect, useState } from 'react';
import { AppStateCtx, backendServer } from "../App.tsx";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/input/Button.tsx';
import { toErrorPage } from '../utility/generic.ts';
import Input from '../components/input/Input.tsx';

import mario from "../assets/Home/mario.png"; // Importa l'immagine di Mario (versione piccola)
import bigMario from "../assets/Home/big-mario.png"; // Importa l'immagine di Mario (versione grande)
import pizza from '../assets/Home/pizza.png'; // Importa l'immagine del logo della pizza

import "./page.css";
import "./landing.css";

/**
 * Componente per la pagina di atterraggio (Landing Page).
 * Consente all'utente di accedere tramite un codice di accesso al tavolo.
 */
function Landing() {
    const [appState, updateAppState] = useContext(AppStateCtx); // Recupera lo stato globale e il metodo per aggiornarlo
    const [param, _] = useSearchParams(); // Recupera i parametri della query string
    const inputInQuery = param.has("accessCode"); // Controlla se il parametro `accessCode` è presente

    // Stato locale per il codice di accesso, l'errore e altri dettagli
    const [accessCode, setAccessCode] = useState<string>(param.get("accessCode") || ""); // Codice di accesso
    const [error, setError] = useState<string | undefined>(); // Messaggio di errore
    const navigate = useNavigate(); // Hook per la navigazione

    // eslint-disable-next-line
    const [name, setName] = useState("Pizzeria da Mimmo"); // Nome del ristorante
    // eslint-disable-next-line
    const [logoUrl, setLogoUrl] = useState(pizza); // URL del logo del ristorante

    /**
     * Effettua l'accesso al tavolo tramite il codice di accesso.
     * Aggiorna lo stato globale con i dettagli del tavolo.
     */
    const accessTable = () => {
        return backendServer.table.logToTable(accessCode)
            .then(table => {
                table.accessCode = accessCode; // Assegna il codice di accesso al tavolo
                updateAppState("table", table); // Aggiorna lo stato globale con i dettagli del tavolo
            });
    };

    /**
     * Effettua automaticamente l'accesso al tavolo se il codice è presente nella query string.
     */
    useEffect(() => {
        if (inputInQuery) {
            accessTable()
                .catch(e => {
                    console.log(e); // Logga l'errore
                    toErrorPage(navigate); // Reindirizza alla pagina di errore
                });
        }
    }, []); // Dipendenze: eseguito una sola volta al montaggio del componente

    /**
     * Tenta di effettuare l'accesso al tavolo quando l'utente inserisce un codice.
     */
    const tryLog = () => {
        const trimCode = accessCode.trim(); // Rimuove eventuali spazi bianchi dal codice
        if (trimCode !== "") {
            accessTable()
                .then(() => {
                    navigate('/home'); // Naviga alla Home Page se l'accesso ha successo
                })
                .catch((e) => {
                    console.log(e); // Logga l'errore
                    setError("Il codice inserito non è valido"); // Imposta un messaggio di errore
                });
        }
    };

    /**
     * Naviga alla Home Page se i dettagli del tavolo sono già presenti nello stato globale.
     */
    const toHome = () => {
        if (appState.table) {
            navigate('/home'); // Naviga alla Home Page
        }
    };

    /**
     * Aggiorna lo stato locale del codice di accesso quando l'utente modifica l'input.
     */
    const handleCodeChange = (e) => {
        setAccessCode(e.target.value);
    };

    /**
     * Determina lo stile del pulsante in base alla presenza di un codice di accesso valido.
     */
    const btnVariant = inputInQuery
        ? (appState.table ? "success" : "secondary")
        : (accessCode.trim() !== "" ? "success" : "secondary");

    return (
        <>
            {/* Intestazione della pagina */}
            <header className='page-box-bg'>
                <h4 id="table" className='luckiest-font'>
                    Tavolo {appState.table ? appState.table.number : "..."} {/* Mostra il numero del tavolo */}
                </h4>
                <div id='welcome-msg'>
                    {/* Mostra l'immagine di Mario (grande o piccola in base alla larghezza dello schermo) */}
                    <picture>
                        <source media='(min-width: 500px)' srcSet={bigMario}></source>
                        <source media="(max-width: 499px)" srcSet={mario}></source>
                        <img src={mario} alt='Mascotte foodquest'></img>
                    </picture>
                    <h3>Foodquest ti da il benvenuto da</h3> {/* Messaggio di benvenuto */}
                </div>
            </header>

            {/* Sezione del logo */}
            <section id="logo">
                <img src={logoUrl} alt={"Logo " + name} /> {/* Mostra il logo */}
                <h1>{name}</h1> {/* Mostra il nome del ristorante */}
            </section>

            {/* Sezione di call-to-action */}
            <section className='call-to-action'>
                {!inputInQuery &&
                    <Input
                        type='text'
                        placeholder='Inserisci il codice'
                        className='cta-input'
                        style={{ maxWidth: "400px", width: "80vw" }}
                        error={error} // Mostra il messaggio di errore
                        value={accessCode}
                        onChange={handleCodeChange} // Aggiorna il codice di accesso
                    />
                }
                <Button
                    variant={btnVariant} // Determina lo stile del pulsante
                    size="lg"
                    className='cta-btn'
                    onClick={inputInQuery ? toHome : tryLog} // Effettua l'accesso o naviga alla home
                >
                    {inputInQuery ? "INIZIA A ORDINARE" : "ACCEDI"} {/* Testo del pulsante */}
                </Button>
            </section>
        </>
    );
}

export default Landing;